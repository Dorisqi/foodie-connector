import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogForm from 'components/form/DialogForm';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Snackbar from 'facades/Snackbar';
import Form from 'facades/Form';

const styles = theme => ({
  productOptionSelector: {
    boxSizing: 'border-box',
    maxWidth: '100%',
    width: 800,
  },
  dialogContent: {
    paddingBottom: 0,
  },
  optionList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.unit,
  },
  option: {
    boxSizing: 'border-box',
    marginTop: 0.8 * theme.spacing.unit,
    marginBottom: 0.8 * theme.spacing.unit,
    marginLeft: 0,
    marginRight: 0,
    paddingRight: theme.spacing.unit,
    minWidth: '50%',
  },
  optionCheckComponent: {
    padding: 0,
    marginRight: theme.spacing.unit,
  },
  price: {
    marginTop: theme.spacing.unit,
    paddingLeft: 3 * theme.spacing.unit,
    paddingRight: 3 * theme.spacing.unit,
    textAlign: 'right',
  },
  amountSelector: {
    margin: 0,
    paddingLeft: 3 * theme.spacing.unit,
    paddingRight: 3 * theme.spacing.unit,
  },
});


class NotificationBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      notifications: props.notifications,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      notifications: nextProps.notifications,
    });
  }

  onClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  onExited = () => {
    this.props.onClose();
  };


  handleRequestSuccess = (res) => {
    Snackbar.success('Successfully mark all notifications as read.');
    this.props.onUpdate(res);
  };

  handleRequestFail = (err) => {

  };

  render() {
    const { notifications } = this.state;
    return (
      <DialogForm
        title="Notification Box"
        submitLabel="mark all as read"
        api={this.props.handleMarkAllRead}
        onRequestSucceed={this.handleRequestSuccess}
        onRequestFailed={this.handleRequestFail}
        onClose={this.props.onClose}
      >
        <List>
          {notifications.map((notification) => {
            const { id, message, isRead } = notification;
            return (
              <ListItem button onClick={this.props.handleMarkRead(id)} disabled={isRead}>
                <ListItemText primary={message} secondary={isRead ? 'read' : 'unread'} />
              </ListItem>
            );
          })}
        </List>
      </DialogForm>
    );
  }
}

NotificationBox.propTypes = {
  classes: PropTypes.object.isRequired,
  notifications: PropTypes.arrayOf({}).isRequired,
  handleMarkRead: PropTypes.func.isRequired,
  handleMarkAllRead: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onClose: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotificationBox);
