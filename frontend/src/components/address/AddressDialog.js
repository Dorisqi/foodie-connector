import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DialogForm from 'components/form/DialogForm';
import InputTextField from 'components/form/InputTextField';
import Maps from 'facades/Maps';
import Api from 'facades/Api';
import Snackbar from 'facades/Snackbar';
import Form from 'facades/Form';
import store from 'store';
import { loadAddress } from 'actions/addressActions';

const styles = theme => ({
  margin: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class AddressDialog extends React.Component {
  state = {
    name: '',
    address: '', // eslint-disable-line react/no-unused-state
    line2: '',
    phone: '',
    placeId: '',
    isDefault: false,
    disableIsDefault: false,
    errors: {},
  };

  constructor(props) {
    super(props);

    const { item: address, currentLocation } = props;
    if (address !== null) {
      this.state = {
        name: address.name,
        // eslint-disable-next-line react/no-unused-state
        address: `${address.line_1}, ${address.city}, ${address.state} ${address.zip_code}`,
        line2: address.line_2,
        phone: address.phone,
        isDefault: address.is_default,
        disableIsDefault: address.is_default,
        errors: {},
      };
    } else if (currentLocation !== null) {
      const state = this.state;
      // eslint-disable-next-line react/no-unused-state
      state.address = currentLocation.formatted_address;
      state.placeId = currentLocation.place_id;
      this.state = state;
    }
  }

  addressInputRef = (ref) => {
    if (ref === null) {
      return;
    }
    Maps.load(() => {
      this.autocomplete = new Maps.maps.places.Autocomplete(
        ref,
        { types: ['geocode'] },
      );
      this.autocomplete.addListener('place_changed', this.handlePlaceChange);
    });
  };

  handlePlaceChange = () => {
    const place = this.autocomplete.getPlace();
    if (_.isNil(place)) {
      this.setState({
        address: '', // eslint-disable-line react/no-unused-state
        placeId: '',
      });
      return;
    }
    this.setState({
      address: place.formatted_address, // eslint-disable-line react/no-unused-state
      placeId: place.place_id,
    });
  };

  handleAddressUpdate = (res) => {
    const addresses = res.data;
    store.dispatch(loadAddress(addresses, addresses[addresses.length - 1].id));
  };

  submit = () => {
    this.setState({
      errors: {},
    });
    const {
      placeId, line2, name, phone, isDefault,
    } = this.state;
    const { item: address } = this.props;
    return address === null
      ? Api.addressAdd(placeId, line2, name, phone, isDefault)
      : Api.addressUpdate(address.id, placeId, line2, name, phone, isDefault);
  };

  handleRequestSuccess = (res) => {
    if (this.props.item === null) {
      Snackbar.success('Successfully add new address.');
    } else {
      Snackbar.success('Successfully update address.');
    }
    this.handleAddressUpdate(res);
  };

  handleRequestFail = (err) => {
    Form.handleErrors(this)(err);
    if (this.state.errors.placeId !== undefined) {
      const { errors } = this.state;
      const newErrors = { ...errors };
      newErrors.address = 'The address is invalid.';
      this.setState({ errors: newErrors });
    }
  };

  handleAddressKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  handleIsDefaultChange = (_e, checked) => {
    this.setState({
      isDefault: checked,
    });
  };

  render() {
    const { classes, item: address, currentLocation } = this.props;
    const { errors, isDefault, disableIsDefault } = this.state;
    const isCreate = address === null;
    const isConfirm = currentLocation === null;
    let title = 'Update Address';
    let submitLabel = 'Update';
    if (isConfirm) {
      title = 'Confirm Address';
      submitLabel = 'Confirm';
    } else if (isCreate) {
      title = 'Create Address';
      submitLabel = 'Create';
    }
    return (
      <DialogForm
        title={title}
        submitLabel={submitLabel}
        formErrors={errors.form}
        api={this.submit}
        onRequestSucceed={this.handleRequestSuccess}
        onRequestFailed={this.handleRequestFail}
        onClose={this.props.onClose}
      >
        <InputTextField
          parent={this}
          name="name"
          label="Alias"
        />
        <InputTextField
          parent={this}
          name="address"
          label="Address"
          inputProps={{
            ref: this.addressInputRef,
            onKeyPress: this.handleAddressKeyPress,
          }}
        />
        <InputTextField
          parent={this}
          name="line2"
          label="Apt #"
          required={false}
        />
        <InputTextField
          parent={this}
          name="phone"
          label="Phone number"
        />
        <FormControlLabel
          className={classes.margin}
          control={(
            <Switch
              checked={isDefault}
              onChange={this.handleIsDefaultChange}
            />
          )}
          disabled={disableIsDefault}
          label="Set as default"
        />
      </DialogForm>
    );
  }
}

AddressDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  currentLocation: PropTypes.object,
};

AddressDialog.defaultProps = {
  item: null,
  currentLocation: null,
};

export default withStyles(styles)(AddressDialog);
