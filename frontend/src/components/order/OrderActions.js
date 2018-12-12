import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import ProgressButton from 'components/form/ProgressButton';
import DialogDeleteAlert from 'components/alert/DialogDeleteAlert';
import ShareOrderDialog from 'components/order/ShareOrderDialog';
import Axios from 'facades/Axios';
import Snackbar from 'facades/Snackbar';
import Api from 'facades/Api';
import classnames from 'classnames';

const styles = theme => ({
  orderActions: {
    flexDirection: 'column',
  },
  action: {
    marginBottom: theme.spacing.unit,
  },
  cancelButton: {
    borderColor: theme.palette.error.light,
    color: theme.palette.error.main,
  },
});

class OrderActions extends React.Component {
  state = {
    confirmingOrder: null,
    cancelAlert: false,
    sharing: false,
  };

  componentWillUnmount() {
    Axios.cancelRequest(this.state.confirmingOrder);
  }

  handleCancelOrderClick = () => {
    this.setState({
      cancelAlert: true,
    });
  };

  handleCancelAlertClose = () => {
    this.setState({
      cancelAlert: false,
    });
  };

  cancelApi = () => {
    const { order } = this.props;
    return Api.orderCancel(order.id);
  };

  handleCancelOrderSuccess = () => {
    this.props.onCancelSuccess();
  };

  handleConfirmOrderClick = () => {
    if (this.state.confirmingOrder) {
      return;
    }
    const { order } = this.props;
    this.setState({
      confirmingOrder: Api.orderConfirm(order.id)
        .then((res) => {
          this.setState({
            confirmingOrder: null,
          });
          this.props.onConfirmSuccess(res.data);
        })
        .catch((err) => {
          this.setState({
            confirmingOrder: null,
          });
          if (err.response.status === 422) {
            Snackbar.error(err.response.data.message);
          } else {
            throw err;
          }
        }),
    });
  };

  handleShareClose = () => {
    this.setState({
      sharing: false,
    });
  };

  handleShareClick = () => {
    this.setState({
      sharing: true,
    });
  };

  render() {
    const { classes, order, showOrderDetailButton } = this.props;
    const { confirmingOrder, cancelAlert, sharing } = this.state;
    const isOrderConfirmable = order === null ? false : (order.order_members.find(
      member => !member.is_ready,
    ) === undefined);
    return (
      <ListItem className={classes.orderActions}>
        <Button
          className={classes.action}
          variant="outlined"
          fullWidth
          onClick={this.handleShareClick}
          disabled={!order.is_joinable}
        >
          Share
        </Button>
        <ShareOrderDialog
          order={order}
          open={sharing}
          onClose={this.handleShareClose}
        />
        {showOrderDetailButton && (
          <Button
            className={classes.action}
            variant="outlined"
            fullWidth
            component={Link}
            to={`/orders/${order.id}`}
          >
            Order Detail
          </Button>
        )}
        {!order.current_order_member.is_ready && (
          <Button
            className={classes.action}
            variant="outlined"
            color="primary"
            fullWidth
            component={Link}
            to={{
              pathname: `/orders/${order.id}/checkout`,
              state: { order },
            }}
          >
            Checkout
          </Button>
        )}
        {order.is_creator && [(
          <ProgressButton
            key="confirm"
            className={classes.action}
            variant="outlined"
            color="primary"
            fullWidth
            loading={confirmingOrder !== null}
            onClick={this.handleConfirmOrderClick}
            disabled={!isOrderConfirmable}
          >
            Confirm Order
          </ProgressButton>
        ), (
          <DialogDeleteAlert
            key="cancel-dialog"
            open={cancelAlert}
            title="Cancel order?"
            text="Do you really want to cancel the order?"
            buttonLabel="Cancel"
            api={this.cancelApi}
            onUpdate={this.handleCancelOrderSuccess}
            onClose={this.handleCancelAlertClose}
            disabled={order.order_status !== 'created'}
          />
        ), (
          <Button
            key="cancel"
            className={classnames([
              classes.cancelButton,
              classes.action,
            ])}
            variant="outlined"
            fullWidth
            onClick={this.handleCancelOrderClick}
          >
            Cancel Order
          </Button>
        )]}
      </ListItem>
    );
  }
}

OrderActions.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  onConfirmSuccess: PropTypes.func.isRequired,
  onCancelSuccess: PropTypes.func.isRequired,
  showOrderDetailButton: PropTypes.bool,
};

OrderActions.defaultProps = {
  showOrderDetailButton: false,
};

export default withStyles(styles)(OrderActions);
