import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Geocode from 'react-geocode';
import store from 'store';
import { loadAddress, selectAddress, setCurrentLocation } from 'actions/addressActions';
import Api from 'facades/Api';

const styles = () => ({});

class AddressSelector extends React.Component {
  state = {
    currentLocationError: null,
  };

  constructor(props) {
    super(props);

    if (props.addresses === null) {
      this.loadAddresses();
    }
  }

  loadAddresses() {
    Api.addressList().then((res) => {
      const addresses = res.data;
      store.dispatch(loadAddress(addresses));
      if (addresses.length === 0) {
        this.loadCurrentLocation(); // Use current location
      } else {
        addresses.forEach(address => {
          if (address.is_default) {
            store.dispatch(selectAddress(address.id));
          }
        });
      }
    });
  }

  loadCurrentLocation() {
    store.dispatch(selectAddress(0));
    if (this.props.currentLocation === null) {
      navigator.geolocation.getCurrentPosition((pos) => {
        Geocode.fromLatLng(pos.coords.latitude, pos.coords.longitude).then((res) => {
          const result = res.results[0];
          this.setState({
            currentLocationError: null,
          });
          store.dispatch(setCurrentLocation(result));
        }).catch((err) => {
          this.setState({
            currentLocationError: err.message,
          });
        });
      }, (err) => {
        this.setState({
          currentLocationError: err.message,
        });
      });
    }
  }

  handleSelectAddress = e => {
    const value = e.target.value;
    if (value > 0) {
      store.dispatch(selectAddress(value));
    } else if (value === 0) {
      this.loadCurrentLocation();
    }
  };

  render() {
    const { selectedAddress, addresses, currentLocation } = this.props;
    const { currentLocationError } = this.state;
    const selectedCurrentLocation = selectedAddress === 0;
    return (
      <div>
        <Select
          value={selectedAddress === null ? -1 : selectedAddress}
          onChange={this.handleSelectAddress}
          error={selectedCurrentLocation && currentLocationError !== null}
          fullWidth>
          {addresses === null &&
          <MenuItem value={-1} disabled>
            Loading...
          </MenuItem>
          }
          {addresses !== null && addresses.map(address => (
            <MenuItem key={address.id} value={address.id}>
              {address.name} - {address.line_1}
            </MenuItem>
          ))
          }
          {addresses !== null &&
          <MenuItem value={0}>
            {currentLocation === null
              ? (selectedCurrentLocation
                  ? (currentLocationError === null
                      ? 'Loading...'
                      : `Failed: ${currentLocationError}`
                  )
                  : 'Use current location'
              )
              : currentLocation.formatted_address
            }
          </MenuItem>
          }
          {addresses !== null &&
          <MenuItem value={-1}>
            + Create new address
          </MenuItem>
          }
        </Select>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedAddress: state.address.selectedAddress,
  addresses: state.address.addresses,
  currentLocation: state.address.currentLocation,
});

AddressSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedAddress: PropTypes.number,
  addresses: PropTypes.array,
  currentLocation: PropTypes.object,
};

export default withStyles(styles)(
  connect(mapStateToProps)(AddressSelector),
);
