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
  setCurrentLocation,
} from 'actions/addressActions';
import Api from 'facades/Api';
import Axios from 'facades/Axios';

const styles = () => ({
  selector: {
    boxSizing: 'border-box',
  },
  selectorInput: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});

class AddressSelector extends React.Component {
  state = {
    currentLocationError: null,
    loadingAddress: null,
  };

  componentDidMount() {
    this.loadAddresses();
  }

  componentWillUnmount() {
    Axios.cancelRequest(this.state.loadingAddress);
  }

  handleSelectAddress = (e) => {
    const value = e.target.value;
    if (value > 0) {
      store.dispatch(selectAddress(value));
    } else if (value === 0) {
      this.loadCurrentLocation();
    }
  };

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

  loadAddresses() {
    if (this.props.addresses !== null) {
      return;
    }
    Axios.cancelRequest(this.state.loadingAddress);
    this.setState({
      loadingAddress: Api.addressList().then((res) => {
        this.setState({
          loadingAddress: null,
        });
        const addresses = res.data;
        store.dispatch(loadAddress(addresses));
        if (addresses.length === 0) {
          this.loadCurrentLocation(); // Use current location
        } else {
          addresses.forEach((address) => {
            if (address.is_default) {
              store.dispatch(selectAddress(address.id));
            }
          });
        }
      }).catch((err) => {
        this.setState({
          loadingAddress: null,
        });
        throw (err);
      }),
    });
  }

  render() {
    const {
      selectedAddress, addresses, currentLocation, classes,
    } = this.props;
    const { currentLocationError } = this.state;
    const selectedCurrentLocation = selectedAddress === 0;
    let nearMeColor = 'primary';
    if (currentLocation === null) {
      nearMeColor = currentLocationError === null ? 'inherit' : 'error';
    }
    let currentLocationText = 'Use current location';
    if (selectedCurrentLocation) {
      if (currentLocation === null) {
        currentLocationText = currentLocationError
          ? `Failed: ${currentLocationError}`
          : 'Loading...';
      } else {
        currentLocationText = currentLocation.formatted_address;
      }
    }
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
                  color={nearMeColor}
                  fontSize="small"
                />
              </InputAdornment>
            )
            : null,
          className: classes.selector,
          classes: {
            input: classes.selectorInput,
          },
        }}
        fullWidth
      >
        {addresses === null
        && (
        <MenuItem value={-1} disabled>
          Loading...
        </MenuItem>
        )
        }
        {addresses !== null && addresses.map(address => (
          <MenuItem key={address.id} value={address.id}>
            {address.name}
            {' '}
-
            {address.line_1}
          </MenuItem>
        ))
        }
        {addresses !== null
        && (
        <MenuItem value={0}>
          {currentLocationText}
        </MenuItem>
        )
        }
        {addresses !== null
        && (
        <MenuItem value={-1}>
          + Create new address
        </MenuItem>
        )
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

AddressSelector.defaultProps = {
  selectedAddress: null,
  addresses: null,
  currentLocation: null,
};

export default withStyles(styles)(
  connect(mapStateToProps)(AddressSelector),
);
