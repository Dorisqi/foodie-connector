import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MainContent from 'components/template/MainContent';
import NotFoundPage from 'components/pages/error/NotFoundPage';
import Axios from 'facades/Axios';
import Api from 'facades/Api';
import Pusher from 'facades/Pusher';
import Maps from 'facades/Maps';

const styles = theme => ({
  subComponent: {
    marginTop: 2 * theme.spacing.unit,
  },
  subComponentTitle: {
    marginBottom: theme.spacing.unit,
  },
  errorText: {
    color: theme.palette.error.main,
  },
  map: {
    height: 400,
  },
});

class OrderDetailPage extends React.Component {
  state = {
    loading: null,
    order: null,
    notFound: false,
  };

  mapRefElement = null;

  map = null;

  orderLocationMarker = null;

  driverLocationMarker = null;

  driverLocation = null;

  componentDidMount() {
    this.loadOrder();
  }

  componentDidUpdate(prevProps, _prevState, _snapshot) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadOrder();
    }
  }

  componentWillUnmount() {
    Axios.cancelRequest(this.state.loading);
    this.unsubscribePusher();
  }

  mapRef = (ref) => {
    if (ref === null) {
      return;
    }
    this.mapRefElement = ref;
    this.updateMap();
  };

  subscribePusher() {
    const { order } = this.state;
    if (!order.is_member) {
      return;
    }
    const channel = Pusher.pusher.subscribe(`private-order.${order.id}`);
    channel.bind('driver-location', (data) => {
      this.driverLocation = {
        lat: data.lat,
        lng: data.lng,
      };
      this.updateMap();
    });
  }

  unsubscribePusher() {
    const id = this.props.match.params.id;
    Pusher.pusher.unsubscribe(`private-order.${id}`);
  }

  loadOrder() {
    Axios.cancelRequest(this.state.loading);
    this.unsubscribePusher();
    const id = this.props.match.params.id;
    this.driverLocation = null;
    this.setState({
      order: null,
      notFound: false,
      loading: Api.orderShow(id)
        .then((res) => {
          this.setState({
            order: res.data,
            notFound: false,
            loading: null,
          });
          this.subscribePusher();
          this.updateMap();
        })
        .catch((err) => {
          this.setState({
            order: null,
            notFound: err.response.status === 404,
            loading: null,
          });
          throw err;
        }),
    });
  }

  updateMap() {
    if (this.mapRefElement === null) {
      return;
    }
    const { order } = this.state;
    if (order === null) {
      return;
    }
    if (this.map === null) {
      const orderLocation = {
        lat: order.geo_location.coordinates[1],
        lng: order.geo_location.coordinates[0],
      };
      Maps.load(() => {
        this.map = new Maps.maps.Map(
          this.mapRefElement,
          {
            zoom: 13,
            center: orderLocation,
          },
        );
        this.updateLocation();
      });
    } else {
      this.updateLocation();
    }
  }

  updateLocation() {
    const { order } = this.state;
    const orderLocation = {
      lat: order.geo_location.coordinates[1],
      lng: order.geo_location.coordinates[0],
    };
    const latLngBounds = new Maps.maps.LatLngBounds();
    if (this.orderLocationMarker === null) {
      this.orderLocationMarker = new Maps.maps.Marker({
        position: orderLocation,
      });
    } else {
      this.orderLocationMarker.setPosition(orderLocation);
    }
    this.orderLocationMarker.setMap(this.map);
    latLngBounds.extend(orderLocation);
    if (this.driverLocation !== null) {
      if (this.driverLocationMarker === null) {
        this.driverLocationMarker = new Maps.maps.Marker({
          position: this.driverLocation,
          icon: {
            path: Maps.maps.SymbolPath.CIRCLE,
            scale: 7,
          },
        });
      } else {
        this.driverLocationMarker.setPosition(this.driverLocation);
      }
      this.driverLocationMarker.setMap(this.map);
      latLngBounds.extend(this.driverLocation);
      this.map.fitBounds(latLngBounds);
    }
  }

  render() {
    const { match, classes } = this.props;
    const { order, notFound, loading } = this.state;
    return notFound
      ? <NotFoundPage />
      : (
        <MainContent title={`Order ${match.params.id}`} loading={loading !== null}>
          {order !== null && (
            <div>
              <div className={classes.subComponent}>
                <Typography className={classes.subComponentTitle} variant="h5" component="h2">
                  Order Information
                </Typography>
                <Card>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Status"
                        secondary={
                          order.order_status[0].toUpperCase()
                          + order.order_status.slice(1)
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Created at"
                        secondary={order.created_at}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Visibility"
                        secondary={order.is_public ? 'Public' : 'Private'}
                      />
                    </ListItem>
                    {order.order_status === 'created' && (
                      <ListItem>
                        <ListItemText
                          primary="Join before"
                          secondary={order.join_before}
                          secondaryTypographyProps={{
                            className: order.is_joinable ? null : classes.errorText,
                          }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Card>
              </div>
              {order.order_status === 'delivering' && (
                <div className={classes.subComponent}>
                  <Typography className={classes.subComponentTitle} variant="h5" component="h2">
                    Tracking
                  </Typography>
                  <div className={classes.map} ref={this.mapRef} />
                </div>
              )}
            </div>
          )}
        </MainContent>
      );
  }
}

OrderDetailPage.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderDetailPage);
