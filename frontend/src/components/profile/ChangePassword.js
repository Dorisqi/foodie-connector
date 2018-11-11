import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ProgressButton from 'components/form/ProgressButton';
import InputTextField from 'components/form/InputTextField';
import Form from 'facades/Form';
import Api from 'facades/Api';
import Axios from 'facades/Axios';
import Snackbar from 'facades/Snackbar';

const styles = () => ({
  dialogContent: {
    paddingTop: 0,
  },
});

class ChangePassword extends React.Component {
  state = {
    open: true,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '', // eslint-disable-line react/no-unused-state
    errors: {}, // eslint-disable-line react/no-unused-state
    requesting: null,
  };

  componentWillUnmount() {
    Axios.cancelRequest(this.state.requesting);
  }

  handleExited = () => {
    this.props.onClose();
  };

  handleClose = () => {
    this.setState({
      open: false,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (!Form.confirmPassword(this, 'newPassword') || this.state.requesting !== null) {
      return;
    }
    this.setState({
      errors: {}, // eslint-disable-line react/no-unused-state
    });
    const { oldPassword, newPassword } = this.state;
    this.setState({
      requesting: Api.profilePasswordUpdate(oldPassword, newPassword).then(() => {
        this.setState({
          requesting: null,
          open: false,
        });
        Snackbar.success('Successfully change password.');
      }).catch(Form.handleErrors(this)),
    });
  };

  render() {
    const { classes } = this.props;
    const { open, requesting } = this.state;
    return (
      <Dialog
        open={open}
        onClose={this.handleClose}
        onExited={this.handleExited}
        aria-labelledby="change-password-title"
      >
        <DialogTitle id="change-password-title">
          Change password
        </DialogTitle>
        <form onSubmit={this.handleSubmit}>
          <DialogContent className={classes.dialogContent}>
            <InputTextField
              parent={this}
              name="oldPassword"
              label="Old password"
              type="password"
            />
            <InputTextField
              parent={this}
              name="newPassword"
              label="New password"
              type="password"
            />
            <InputTextField
              parent={this}
              name="confirmPassword"
              label="Confirm password"
              type="password"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose}>
              Cancel
            </Button>
            <ProgressButton loading={requesting !== null} type="submit" color="primary">
              Change
            </ProgressButton>
          </DialogActions>
        </form>
      </Dialog>
    );
  }
}

ChangePassword.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(ChangePassword);
