import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from 'facades/Snackbar';

const styles = () => ({
  dialogPaper: {
    maxWidth: '95%',
    width: 600,
  },
  dialogContent: {
    paddingTop: '0 !important',
  },
});

class NotificationDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: props.notifications,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      notifications: nextProps.notifications,
    });
  }

  handleClose = () => {
    this.props.onClose();
  };

  submit = (event) => {
    this.handleClose();
    this.props.handleMarkAllRead();
    Snackbar.success('Successfully mark all notifications as read.');
    event.preventDefault();
  }

  handleClear = () => {
    this.props.handleClear();
  }

  render() {
    const { classes, open } = this.props;
    const { notifications } = this.state;
    return (
      <Dialog
        classes={{
          paper: classes.dialogPaper,
        }}
        open={open}
        onClose={this.handleClose}
        onExited={this.handleClose}
        aria-labelledby="dialog-form-title"
      >
        <DialogTitle id="dialog-form-title">
          Notification Box
        </DialogTitle>
        <form onSubmit={this.submit}>
          <DialogContent className={classes.dialogContent}>
            <List>
              {notifications.map((notification) => {
                const {
                  id, order_id: orderId, status, isRead,
                } = notification;
                return (
                  <ListItem button onClick={this.props.handleMarkRead(id)} disabled={isRead}>
                    <ListItemText
                      primary={`order(${orderId}) has updated status: ${status}`}
                      secondary={isRead ? 'read' : 'unread'}
                    />
                  </ListItem>
                );
              })}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>
              Close
            </Button>
            <Button onClick={this.handleClear} color="secondary">
              Clear All
            </Button>
            <Button type="submit" color="primary">
              mark all as read
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

NotificationDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleMarkRead: PropTypes.func.isRequired,
  handleMarkAllRead: PropTypes.func.isRequired,
  handleClear: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(NotificationDialog);
