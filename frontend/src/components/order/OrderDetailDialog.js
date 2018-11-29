import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = () => ({
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    textAlign: 'left',
  },
  // thumbUp: {
  //   color: '#FF0000',
  // },
  // thumbDown: {
  //   color: '#33FE0B',
  // },
});

class OrderDetailDialog extends React.Component {
  render() {
    const {
      classes, open, order, onClose,
    } = this.props;
    const {
      order_members: orderMembers,
      order_statuses: orderStatuses,
    } = order;

    const statusesRow = orderStatuses.map(status => (
      <TableRow>
        <TableCell>{status.status}</TableCell>
        <TableCell>{status.time}</TableCell>
      </TableRow>
    ));

    const membersRow = orderMembers.map((member) => {
      const {
        user,
        phone,
        is_ready: isReady,
        subtotal,
        tax,
        tip,
        delivery_fee: deliveryFee,
        total,
        rate_is_positive: rate,
      } = member;
      return (
        <TableRow>
          <TableCell>{user.name}</TableCell>
          <TableCell>{phone}</TableCell>
          <TableCell>{isReady ? 'Ready' : 'Not Ready'}</TableCell>
          <TableCell>{subtotal}</TableCell>
          <TableCell>{tax}</TableCell>
          <TableCell>{tip}</TableCell>
          <TableCell>{deliveryFee}</TableCell>
          <TableCell>{total}</TableCell>
          <TableCell>
            {// eslint-disable-next-line no-nested-ternary
            rate !== null && rate !== undefined
              ? (
                rate
                  ? <i className="material-icons" style={{ color: '#FF0000' }}>thumb_up</i>
                  : <i className="material-icons" style={{ color: '#33FE0B' }}>thumb_down</i>
              )
              : null
          }
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        aria-labelledby="share-order-dialog-title"
      >
        <DialogTitle id="share-order-dialog-title">
          Order Detail
          {' '}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <h5 className={classes.title}>Order Statuses</h5>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>status</TableCell>
                <TableCell>time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statusesRow}
            </TableBody>
          </Table>
          <h5 className={classes.title}>Member Info</h5>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>user name</TableCell>
                <TableCell>phone</TableCell>
                <TableCell>is ready</TableCell>
                <TableCell>subtotal</TableCell>
                <TableCell>tax</TableCell>
                <TableCell>tip</TableCell>
                <TableCell>delivery fee</TableCell>
                <TableCell>total</TableCell>
                <TableCell>rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {membersRow}
            </TableBody>
          </Table>
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

OrderDetailDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  order: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(OrderDetailDialog);
