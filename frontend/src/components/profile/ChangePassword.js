import React from 'react';
import PropTypes from 'prop-types';
import DialogForm from 'components/form/DialogForm';
import InputTextField from 'components/form/InputTextField';
import Form from 'facades/Form';
import Api from 'facades/Api';
import Snackbar from 'facades/Snackbar';

class ChangePassword extends React.Component {
  state = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '', // eslint-disable-line react/no-unused-state
    errors: {},
  };

  submit = () => {
    if (!Form.confirmPassword(this, 'newPassword')) {
      return null;
    }
    this.setState({
      errors: {},
    });
    const { oldPassword, newPassword } = this.state;
    return Api.profilePasswordUpdate(oldPassword, newPassword);
  };

  handleRequestSuccess = () => {
    Snackbar.success('Successfully change password.');
  };

  render() {
    const { errors } = this.state;
    return (
      <DialogForm
        title="Change Password"
        submitLabel="Change"
        formErrors={errors.form}
        api={this.submit}
        onRequestSucceed={this.handleRequestSuccess}
        onRequestFailed={Form.handleErrors(this)}
        onClose={this.props.onClose}
      >
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
      </DialogForm>
    );
  }
}

ChangePassword.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ChangePassword;
