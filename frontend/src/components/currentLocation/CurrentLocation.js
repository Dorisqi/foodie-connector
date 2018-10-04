import React from 'react';
import { geolocated } from 'react-geolocated';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import Geocode from 'react-geocode';


const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

class CurrentGeoLocation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      isClick: true,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    Geocode.setApiKey('AIzaSyByyQbkhN7phUklrozYqk6QWw28lDU_dMg');
    Geocode.enableDebug();
    console.log(typeof this.props.coords.latitude);
    Geocode.fromLatLng(this.props.coords.latitude, this.props.coords.longitude).then(
      (response) => {
        const address = response.results[0].formatted_address;
        this.setState({ address: address });
        //console.log(address);
      },
      (error) => {
        //console.error(error);
        this.setState({ error: error });
      },
    );
    this.setState(state => ({
      isClick: !state.isClick,
    }));
  }
  render() {
    const { classes } = this.props;
    return !this.props.isGeolocationAvailable
      ? <div>Your browser does not support Geolocation</div>
      : !this.props.isGeolocationEnabled
        ? <div>Geolocation is not enabled</div>
        : this.props.coords
          ? (
            <Button
              onClick={this.handleClick}
              color="default"
              variant="contained"
              size="small"
              className={classes.button}
            >
              {this.state.isClick ? 'Current Address' : this.state.address}
            </Button>
          )
          : <div>Getting the location data&hellip; </div>;
  }
}
CurrentGeoLocation.propTypes = {
  classes: PropTypes.element.isRequired,
  coords: PropTypes.shape({
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
};
export default compose(
  withStyles(styles),
  geolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  }),
)(CurrentGeoLocation);
