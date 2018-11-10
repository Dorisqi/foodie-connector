import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import AuthTemplate from 'components/template/AuthTemplate';
import DocumentTitle from 'components/template/DocumentTitle';
import InputTextField from 'components/form/InputTextField';
import FormErrorMessages from 'components/form/FormErrorMessages';
import Api from 'facades/Api';
import Form from 'facades/Form';
import Axios from 'facades/Axios';

const styles = theme => ({
  title: {
    marginBottom: 50,
  },
  margin: {
    margin: theme.spacing.unit,
  },
});

class ResetPasswordPage extends React.Component {
  state = {
    email: '',
    token: '',
    password: '',
    confirmPassword: '', // eslint-disable-line react/no-unused-state
    errors: {},
    sentCode: false,
    loading: null,
  };

  componentWillUnmount() {
    Axios.cancelRequest(this.state.loading);
  }

  handleSubmit = (e) => {
    const { sentCode } = this.state;
    e.preventDefault();
    this.setState({
      errors: {},
    });
    if (!sentCode) {
      this.sendEmail();
    } else {
      this.resetPassword();
    }
  };

  sendEmail = () => {
    const { email, loading } = this.state;
    Axios.cancelRequest(loading);
    this.setState({
      loading: Api.resetPasswordEmail(email).then(() => {
        this.setState({
          sentCode: true,
        });
      }).catch(Form.handleErrors(this)),
    });
  };

  resetPassword = () => {
    if (!Form.confirmPassword(this)) {
      return;
    }
    const {
      email, token, password, loading,
    } = this.state;
    const { history, location } = this.props;
    Axios.cancelRequest(loading);
    this.setState({
      loading: Api.resetPassword(email, token, password)
        .then(() => {
          history.push({
            pathname: '/login',
            search: location.search,
          });
        })
        .catch(Form.handleErrors(this)),
    });
  };

  render() {
    const { classes } = this.props;
    const { errors, sentCode } = this.state;

    return (
      <DocumentTitle title="Reset Password">
        <AuthTemplate>
          <Typography className={classes.title} variant="h4" component="h1">
            Reset Password
          </Typography>
          <form onSubmit={this.handleSubmit}>
            <FormErrorMessages errors={errors.form} />
            <InputTextField
              parent={this}
              name="email"
              label="Email"
              type="email"
            />
            <FormControl className={classes.margin} fullWidth>
              <Button
                type={sentCode ? 'button' : 'submit'}
                variant={sentCode ? 'outlined' : 'contained'}
                color="primary"
                onClick={sentCode ? this.sendEmail : null}
              >
                {sentCode ? 'Resend Code' : 'Send Code'}
              </Button>
            </FormControl>
            {sentCode
            && (
            <InputTextField
              parent={this}
              name="token"
              label="Token"
            />
            )
            }
            {sentCode
            && (
            <InputTextField
              parent={this}
              name="password"
              label="New Password"
              type="password"
            />
            )
            }
            {sentCode
            && (
            <InputTextField
              parent={this}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
            />
            )
            }
            {sentCode
            && (
            <FormControl className={classes.margin} fullWidth>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Reset Password
              </Button>
            </FormControl>
            )
            }
          </form>
        </AuthTemplate>
      </DocumentTitle>
    );
  }
}

ResetPasswordPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResetPasswordPage);
