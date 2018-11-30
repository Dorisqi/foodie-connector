import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import store from 'store';
import { loadAddress, selectAddress, setCurrentLocation } from 'actions/addressActions';
import Api from 'facades/Api';
import Axios from 'facades/Axios';
import AddressDialog from 'components/address/AddressDialog';

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
    addingAddress: false,
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
    } else {
      this.setState({
        addingAddress: true,
      });
    }
  };

  handleAddingAddressClose = () => {
    this.setState({
      addingAddress: false,
    });
  };

  loadCurrentLocation() {
    store.dispatch(selectAddress(0));
    if (this.props.currentLocation === null) {
      navigator.geolocation.getCurrentPosition((pos) => {
        Api.geoCodingByCoords(pos.coords.latitude, pos.coords.longitude).then((res) => {
          const result = res.data;
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
      if (this.props.addresses.length === 0) {
        this.loadCurrentLocation();
      }
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
          this.loadCurrentLocation();
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
    const { currentLocationError, addingAddress } = this.state;
    const selectedCurrentLocation = selectedAddress === 0;
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
      <div>
        {addingAddress
        && (
        <AddressDialog
          onClose={this.handleAddingAddressClose}
        />
        )
        }
        <TextField
          select
          variant="outlined"
          value={selectedAddress === null ? -1 : selectedAddress}
          onChange={this.handleSelectAddress}
          error={selectedCurrentLocation && currentLocationError !== null}
          InputProps={{
            className: classes.selector,
            classes: {
              input: classes.selectorInput,
            },
          }}
          fullWidth
        >
          {addresses === null
            ? (
              <MenuItem value={-1} disabled>
                Loading...
              </MenuItem>
            ) : [
              addresses.map(address => (
                <MenuItem key={address.id} value={address.id}>
                  {address.name}
                  {' - '}
                  {address.line_1}
                </MenuItem>
              )), (
                <MenuItem key={0} value={0}>
                  {currentLocationText}
                </MenuItem>
              ), (
                <MenuItem key={-1} value={-1}>
                  + Create new address
                </MenuItem>
              ),
            ]
          }
        </TextField>
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

AddressSelector.defaultProps = {
  selectedAddress: null,
  addresses: null,
  currentLocation: null,
};

export default withStyles(styles)(
  connect(mapStateToProps)(AddressSelector),
);
