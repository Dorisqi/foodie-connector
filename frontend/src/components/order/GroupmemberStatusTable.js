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

class GroupmemberStatusTable extends React.Component {
  state = {

    loadingGroupmbr: null,
    members: false,
    creator: null
  };

  componentDidMount() {
    this.loadAddresses();
  }

  componentWillUnmount() {
    //Axios.cancelRequest(this.state.loadingAddress);
  }

/*  handleSelectAddress = (e) => {
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
  };*/


  handleGroupmbrUpdate = (res) => {
    // TODO:  GET - /api/v1/orders/{id}
    const groupmbrs = res.data;
    //store.dispatch(loadAddress(addresses, addresses[addresses.length - 1].id));
  };


  loadGroupmbr() {
  /*  if (this.props.addresses !== null) {
      if (this.props.addresses.length === 0) {
        this.loadCurrentLocation();
      }
      return;
    }*/
    Axios.cancelRequest(this.state.loadingGroupmbr);
    this.setState({
      loadingGroupmbr: Api.addressList().then((res) => {
        this.setState({
          loadingGroupmbr: null,
        });
        // TODO:  extract the groupmbrs info from the data
        //const members = res.data;
        //store.dispatch(loadAddress(addresses));

      }).catch((err) => {
        this.setState({
          loadingGroupmbr: null,
        });
        throw (err);
      }),
    });
  }

  render() {
    const {
      members, currentLocation, classes,
    } = this.props;
    const { currentLocationError, addingAddress } = this.state;
    const selectedCurrentLocation = selectedAddress === 0;
    let currentLocationText = 'Use current location';

    return (
      <div>

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
          {members === null
            ? (
              <MenuItem value={-1} disabled>
                Loading...
              </MenuItem>
            ) : [
              members.map(member => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}

                  {member.is_ready}
                </MenuItem>
              ))
            ]
          }
        </TextField>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  addresses: state.address.addresses,
  //currentLocation: state.address.currentLocation,
});

GroupmemberStatusTable.propTypes = {
  classes: PropTypes.object.isRequired,
  members: PropTypes.array,
  //currentLocation: PropTypes.object,
};

GroupmemberStatusTable.defaultProps = {
  members: null,
  creator: null,
  loadingGroupmbr:null
};

export default withStyles(styles)(
  connect(mapStateToProps)(GroupmemberStatusTable),
);
