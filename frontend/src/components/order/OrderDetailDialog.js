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
    const maxLen = Math.max(orderMembers.length, orderStatuses.length);
    const rows = [];
    for (let i = 0; i < maxLen; i += 1) {
      const ready = orderMembers[i].is_ready ? 'Ready' : 'Not Ready';
      rows.push(
        <TableRow>
          <TableCell>{i < orderStatuses.length ? orderStatuses[i].status : null}</TableCell>
          <TableCell>{i < orderStatuses.length ? orderStatuses[i].time : null}</TableCell>
          <TableCell>{i < orderMembers.length ? orderMembers[i].user.name : null}</TableCell>
          <TableCell>{i < orderMembers.length ? orderMembers[i].phone : null}</TableCell>
          <TableCell>{i < orderMembers.length ? ready : null}</TableCell>
        </TableRow>,
      );
    }

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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2}>Order statuses</TableCell>
                <TableCell colSpan={3}>Order members</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>status</TableCell>
                <TableCell>time</TableCell>
                <TableCell>user name</TableCell>
                <TableCell>phone</TableCell>
                <TableCell>is ready</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows}
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
