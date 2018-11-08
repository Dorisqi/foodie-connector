import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import NearMe from '@material-ui/icons/NearMe';
import TextField from '@material-ui/core/TextField';
import Geocode from 'react-geocode';
import store from 'store';
import {
  loadAddress,
  selectAddress,
  setCurrentLocation
} from 'actions/addressActions';
import Api from 'facades/Api';

const styles = () => ({
  selector: {
    boxSizing: 'border-box',
  },
  selectorInput: {
    paddingTop: 6,
    paddingBottom: 7,
  }
});

class AddressSelector extends React.Component {
  state = {
    currentLocationError: null,
  };

  componentDidMount() {
    this.loadAddresses();
  }

  componentDidUpdate(_prevProps, _prevState, _snapshot) {
    this.loadAddresses();
  }

  loadAddresses() {
    if (this.props.addresses !== null) {
      return;
    }
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
    const { selectedAddress, addresses, currentLocation, classes } = this.props;
    const { currentLocationError } = this.state;
    const selectedCurrentLocation = selectedAddress === 0;
    return (
      <TextField
        select
        variant="outlined"
        value={selectedAddress === null ? -1 : selectedAddress}
        onChange={this.handleSelectAddress}
        error={selectedCurrentLocation && currentLocationError !== null}
        InputProps={{
          startAdornment: selectedCurrentLocation
            ? (
              <InputAdornment position="start">
                <NearMe
                  color={currentLocation === null
                    ? (currentLocationError === null
                        ? 'inherit'
                        : 'error')
                    : 'primary'}
                  fontSize="small" />
              </InputAdornment>
            )
            : null,
          className: classes.selector,
          classes: {
            input: classes.selectorInput,
          }
        }}
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
      </TextField>
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
