import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Add from '@material-ui/icons/Add';
import Remove from '@material-ui/icons/Remove';
import Typography from '@material-ui/core/Typography';
import { cartUpdateAmount } from 'actions/cartActions';
import store from 'store';

const styles = theme => ({
  amountSelector: {
    display: 'flex',
    alignItems: 'center',
    marginRight: -theme.spacing.unit,
    marginLeft: -theme.spacing.unit,
  },
  placeHolder: {
    flexGrow: 1,
  },
  button: {
    padding: theme.spacing.unit,
    marginTop: -theme.spacing.unit,
    marginBottom: -theme.spacing.unit,
  },
  buttonIcon: {
    fontSize: '1rem',
  },
});

class AmountSelector extends React.Component {
  handleAdd = (e) => {
    e.stopPropagation();
    const { value, cartIndex, onUpdate } = this.props;
    if (cartIndex === null) {
      onUpdate(value + 1);
    } else {
      store.dispatch(cartUpdateAmount(cartIndex, value + 1));
    }
  };

  handleRemove = (e) => {
    e.stopPropagation();
    const { value, cartIndex, onUpdate } = this.props;
    if (cartIndex === null) {
      onUpdate(value - 1);
    } else {
      store.dispatch(cartUpdateAmount(cartIndex, value - 1));
    }
  };

  render() {
    const { classes, value } = this.props;
    return (
      <div className={classes.amountSelector}>
        <div className={classes.placeHolder} />
        <IconButton
          className={classes.button}
          size="small"
          onClick={this.handleRemove}
          disabled={value <= 0}
        >
          <Remove className={classes.buttonIcon} />
        </IconButton>
        <Typography variant="body1" component="span">
          {value}
        </Typography>
        <IconButton
          className={classes.button}
          size="small"
          onClick={this.handleAdd}
        >
          <Add className={classes.buttonIcon} />
        </IconButton>
      </div>
    );
  }
}

AmountSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  value: PropTypes.number.isRequired,
  cartIndex: PropTypes.number,
  onUpdate: PropTypes.func,
};

AmountSelector.defaultProps = {
  cartIndex: null,
  onUpdate: null,
};

export default withStyles(styles)(AmountSelector);
