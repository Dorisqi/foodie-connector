import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Geocode from 'react-geocode';
import Card from '@material-ui/core/Card';
import compose from '../../../node_modules/recompose/compose';
import Button from '../../material-kit/components/CustomButtons/Button';
import { geolocated } from 'react-geolocated';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  card: {
    maxWidth: 350,
    Height:50
  },
  button: {
    marginLeft: theme.spacing.unit*2,
    marginRight: theme.spacing.unit*2,

  },

});

class AddressSearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      place_id:'',
      isClick: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlegetLocation = this.handlegetLocation.bind(this);
  }

  handlegetLocation() {
      //console.log(typeof this.props.coords.latitude);
      Geocode.fromLatLng(this.props.coords.latitude, this.props.coords.longitude).then(
        (response) => {

          const address = response.results[0].formatted_address;
          this.setState({ address: address });


        },
        (error) => {
          //console.error(error);
          this.setState({ error: error });
        },
      );
      this.setState(state => ({
        isClick: !this.state.isClick,
      }));
    }

  handleChange(event) {
    const { value } = event.target;
    const { handleAddressChange } = this.props;
    handleAddressChange(value);
  }

  render() {
    const { classes } = this.props;
    const { address } = this.state;
    return (
      <Card className={classes.card}>
        <FormControl className={classes.form} marginRight="dense" required>
        {!this.props.isGeolocationAvailable
         ? <div>Your browser does not support Geolocation</div>
         : !this.props.isGeolocationEnabled
           ? <div>Geolocation is not enabled</div>
           : this.props.coords
           ? (
             <Button className={classes.button}
                     onClick={this.handlegetLocation}
                       color="info"
                       variant="contained" fullWidth={false}>
             {this.state.isClick ? 'Use Current Location' : this.state.address}
             </Button>

           )
           :<div>Getting the location data&hellip; </div>}
             </FormControl>
            <FormControl className={classes.form} marginRight="dense" required>
              <TextField
                id="standard-with-placeholder"
                label="Address"
                placeholder="Address"
                className={classes.textField}
                margin="normal"
                onChange={this.handleChange}
              />
           </FormControl>
      </Card>
    );
  }
}
AddressSearchBar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  handleAddressChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};
export default compose (withStyles(styles),geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
}),
)(AddressSearchBar);
