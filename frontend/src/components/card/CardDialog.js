import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import DialogForm from 'components/form/DialogForm';
import InputTextField from 'components/form/InputTextField';
import Api from 'facades/Api';
import Snackbar from 'facades/Snackbar';
import Form from 'facades/Form';
import Stripe from 'facades/Stripe';
import classnames from 'classnames';

const styles = theme => ({
  margin: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  stripeField: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
    paddingTop: 6,
    paddingBottom: 7,
    '&:hover': {
      paddingBottom: 6,
      borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
    },
    '&:focus-within': {
      paddingBottom: 6,
      borderBottomWidth: 2,
      borderBottomColor: theme.palette.primary.main,
    },
  },
  stripeFieldError: {
    paddingBottom: 6,
    borderBottom: '2px solid #e64a19',
  },
});

const stripeStyle = {
  base: {
    fontSize: '16px',
  },
};

class CardDialog extends React.Component {
  state = {
    nickname: '',
    expirationMonth: '',
    expirationYear: '',
    zipCode: '',
    isDefault: false,
    disableIsDefault: false,
    errors: {},
  };

  constructor(props) {
    super(props);

    const { item: card } = props;
    if (card !== null) {
      this.state = {
        nickname: card.nickname,
        expirationMonth: card.expiration_month,
        expirationYear: card.expiration_year,
        zipCode: card.zip_code,
        isDefault: card.is_default,
        disableIsDefault: card.is_default,
        errors: {},
      };
    }
  }

  handleIsDefaultChange = (_e, checked) => {
    this.setState({
      isDefault: checked,
    });
  };

  mountStripe = (ref) => {
    if (ref === null) {
      return;
    }
    Stripe.exec((stripe) => {
      const elements = stripe.elements();
      this.card = elements.create('card', { style: stripeStyle });
      this.card.mount(ref);
      this.card.addEventListener('change', this.handleStripeChange);
    });
  };

  handleStripeChange = (event) => {
    const { errors } = this.state;
    if (!_.isNil(event.error)) {
      this.setState({
        errors: {
          ...errors,
          stripe: event.error.message,
        },
      });
    } else {
      const newErrors = { ...errors };
      delete newErrors.stripe;
      this.setState({
        errors: newErrors,
      });
    }
  };

  submit = () => {
    this.setState({
      errors: {},
    });
    const {
      nickname, expirationMonth, expirationYear, zipCode, isDefault,
    } = this.state;
    const { item: card } = this.props;
    return card === null
      ? new Promise((resolve, reject) => {
        Stripe.exec((stripe) => {
          stripe.createToken(this.card).then((result) => {
            if (!_.isNil(result.error)) {
              reject(result.error);
            } else {
              Api.cardAdd(nickname, result.token.id, isDefault).then(resolve).catch(reject);
            }
          });
        });
      })
      : Api.cardUpdate(card.id, nickname, expirationMonth, expirationYear, zipCode, isDefault);
  };

  handleRequestSuccess = (res) => {
    if (this.props.item === null) {
      Snackbar.success('Successfully add new card.');
    } else {
      Snackbar.success('Successfully update address.');
    }
    this.props.onUpdate(res);
  };

  handleRequestFail = (err) => {
    if (err.response === null) {
      this.setState({
        errors: {
          stripe: err.message,
        },
      });
    } else {
      Form.handleErrors(this)(err);
    }
  };

  render() {
    const { classes, item: card } = this.props;
    const { errors, isDefault, disableIsDefault } = this.state;
    const isCreate = card === null;
    return (
      <DialogForm
        title={isCreate ? 'Add New Card' : 'Update Card'}
        submitLabel={isCreate ? 'Add' : 'Update'}
        formErrors={errors.form}
        api={this.submit}
        onRequestSucceed={this.handleRequestSuccess}
        onRequestFailed={this.handleRequestFail}
        onClose={this.props.onClose}
      >
        <InputTextField
          parent={this}
          name="nickname"
          label="Alias"
        />
        {isCreate
          ? (
            <div className={classes.margin}>
              <div
                className={errors.stripe === undefined
                  ? classes.stripeField
                  : classnames([classes.stripeField, classes.stripeFieldError])
                }
                ref={this.mountStripe}
              />
              {errors.stripe !== undefined
              && (
                <FormHelperText error>
                  {errors.stripe}
                </FormHelperText>
              )
              }
            </div>
          ) : ([(
            <InputTextField
              parent={this}
              name="expirationMonth"
              label="Exp. Month"
            />
          ), (
            <InputTextField
              parent={this}
              name="expirationYear"
              label="Exp. Year"
            />
          ), (
            <InputTextField
              parent={this}
              name="zipCode"
              label="Zip Code"
            />
          ),
          ])
        }
        <FormControlLabel
          className={classes.margin}
          control={(
            <Switch
              checked={isDefault}
              onChange={this.handleIsDefaultChange}
            />
          )}
          disabled={disableIsDefault}
          label="Set as default"
        />
      </DialogForm>
    );
  }
}

CardDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  item: PropTypes.object,
};

CardDialog.defaultProps = {
  item: null,
};


export default withStyles(styles)(CardDialog);
