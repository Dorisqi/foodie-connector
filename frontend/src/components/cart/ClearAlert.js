import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { cartClear, cartCloseClearAlert } from 'actions/cartActions';
import store from 'store';

class ClearAlert extends React.Component {
  handleClose = () => {
    store.dispatch(cartCloseClearAlert());
  };

  handleClearClick = () => {
    store.dispatch(cartClear());
  };

  render() {
    const { clearAlert, restaurantName, restaurantId } = this.props;
    return (
      <Dialog
        open={clearAlert !== null}
        onClose={this.handleClose}
        aria-labelledby="clear-alert-dialog-title"
        aria-describedby="clear-alert-dialog-description"
      >
        <DialogTitle id="clear-alert-dialog-title">
          Clear cart?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-alert-dialog-description">
            You have items from another restaurant
            (
            <Link to={`/restaurants/${restaurantId}`} onClick={this.handleClose}>{restaurantName}</Link>
)
            in your cart. Please clear the cart before adding items.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose}>
            Cancel
          </Button>
          <Button onClick={this.handleClearClick} color="primary" autoFocus>
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => ({
  restaurantId: state.cart.restaurantId,
  restaurantName: state.cart.restaurantName,
  clearAlert: state.cart.clearAlert,
});

ClearAlert.propTypes = {
  restaurantId: PropTypes.number,
  restaurantName: PropTypes.string,
  clearAlert: PropTypes.object,
};

ClearAlert.defaultProps = {
  restaurantId: null,
  restaurantName: null,
  clearAlert: null,
};

export default connect(mapStateToProps)(ClearAlert);
