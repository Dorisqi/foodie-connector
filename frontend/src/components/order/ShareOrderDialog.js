import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const styles = () => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

class ShareOrderDialog extends React.Component {
  render() {
    const {
      classes, open, onClose, order,
    } = this.props;
    return (
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="share-order-dialog-title"
      >
        <DialogTitle id="share-order-dialog-title">
          Order
          {' '}
          {order.id}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <img alt="qr-code" src={order.qr_code_link} />
          <Link to={order.share_link}>
            {order.share_link}
          </Link>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ShareOrderDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShareOrderDialog);
