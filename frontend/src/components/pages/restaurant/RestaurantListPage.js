import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Api from 'facades/Api';
import apiList from 'apiList';
import axios from 'axios';
import Geocode from 'react-geocode';
import Divider from '@material-ui/core/Divider/Divider';
import AddressSelector from 'components/address/AddressSelector';
import OptionListItem from 'components/restaurant/OptionListItem';

const DEFAULT_ADDRESS = 'Purdue Memorial Union';

const styles = theme => ({
  divider: {
    marginTop: 2 * theme.spacing.unit,
    marginBottom: 2 * theme.spacing.unit,
  },
  paper: {
    marginTop: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
  },
  center: {
    display: 'table',
    marginTop: 0,
    marginRight: 'auto',
  },
});

class RestaurantListPage extends React.Component {
  state = {
    address: '',
    place_id: '',
    tags: [],
    tag_ids: '',
    originalList: [],
    changedList: [],
    nameMatchList: [],
    filter_distance: '',
    filter_estimated_delivery_time: '',
    filter_delivery_fee: '',
    filter_order_minimum: '',
    filter_rating: '',
    restaurants: null,
    loading: false,
    error: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps, __, ___) {
    const { selectedAddress, currentLocation } = this.props;
    if (prevProps.selectedAddress !== selectedAddress
      || (selectedAddress === 0 && prevProps.currentLocation !== currentLocation)) {
      this.loadList();
    }
  }

  loadList() {
    const { selectedAddress, currentLocation } = this.props;
    let params = null;
    if (selectedAddress === null) {
      return;
    }
    if (selectedAddress === 0) {
      if (currentLocation === null) {
        return;
      }
      params = {
        'place_id': currentLocation.place_id,
      }
    } else {
      params = {
        'address_id': selectedAddress,
      }
    }
    this.setState({
      loading: true,
    });
    Api.restaurantList(params).then((res) => {
      this.setState({
        restaurants: res.data.restaurants,
        error: null,
        loading: false,
      });
    }).catch((err) => {
      this.setState({
        restaurants: null,
        error: err.response.message,
        loading: false,
      })
    });
  }

  handleNameChange(name) {
    const { changedList } = this.state;
    this.setState({
      nameMatchList: changedList.filter(item => item.name.toLowerCase().indexOf(name.toLowerCase()) != -1),
    });
  }

  getParams() {
    const {
      place_id,
      tag_ids,
      filter_distance,
      filter_estimated_delivery_time,
      filter_delivery_fee,
      filter_order_minimum,
      filter_rating,
    } = this.state;

    const params = {
      place_id: place_id,
    };
    if (tag_ids && tag_ids.length > 0) {
      params['filter_categories'] = tag_ids;
    }
    params['filter_distance'] = filter_distance;
    params['filter_estimated_delivery_time'] = filter_estimated_delivery_time;
    params['filter_delivery_fee'] = filter_delivery_fee;
    params['filter_order_minimum'] = filter_order_minimum;
    params['filter_rating'] = filter_rating;

    return params;
  }

  handleSubmit(address = '') {
    if (address === '') {
      address = this.state.address;
    }
    Geocode.fromAddress(address)
      .then(
        res => {
          this.getRestaurants(res.results[0].place_id);
        }
        , err => {
          console.log(err);
        },
      );
    //event.preventDefault();
  }

  getRestaurants(place_id) {
    const params = this.getParams();
    axios.get(apiList.restaurants, {
      params: params,
    })
      .then(res => {
        if (res.data) {
          this.setState({
            place_id: place_id,
            originalList: res.data.restaurants.slice(),
            changedList: res.data.restaurants.slice(),
            nameMatchList: res.data.restaurants.slice(),
          });
        }
        else {
          console.log(res);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleOtherFilter(filters) {
    this.setState({
      filter_distance: filters.distanceLo + '_' + filters.distanceHi,
      filter_estimated_delivery_time: filters.deliveryTimeLo + '_' + filters.deliveryTimeHi,
      filter_delivery_fee: filters.deliveryFeeLo + '_' + filters.deliveryFeeHi,
      filter_order_minimum: filters.orderMinLo + '_' + filters.orderMinHi,
      filter_rating: filters.ratingLo + '_' + filters.ratingHi,
    }, () => this.handleSubmit());
  }

  handleFilterChange(selectedTags) {
    var tag_ids = '';

    for (var i = 0; i < selectedTags.length; i++) {
      if (selectedTags[i].name !== 'All') {
        tag_ids += '_' + selectedTags[i].id;
      }
    }
    if (tag_ids !== '') {
      tag_ids = tag_ids.slice(1, tag_ids.length);
    }
    this.setState({
      tag_ids: tag_ids,
    });
  }

  handleSortChange(sortOrder) {
    const { nameMatchList } = this.state;
    if (sortOrder === 'default') {
      this.setState({
        changedList: nameMatchList,
      });
    }
    else if (sortOrder === 'rating') {
      this.setState({
        changedList: nameMatchList.concat().sort((o1, o2) => o2.rating - o1.rating),
      });
    }
    else {
      this.setState({
        changedList: nameMatchList.concat().sort((o1, o2) => o1[sortOrder] - o2[sortOrder]),
      });
    }
  }

  handleAddressChange(address) {
    this.setState({ address: address });
  }

  render() {
    const { classes } = this.props;
    const { restaurants } = this.state;
    return (
      <div>
        <Typography variant="h4">
          Restaurants
        </Typography>
        <Divider className={classes.divider} />
        <OptionListItem>
          <div>Your Address:</div>
          <AddressSelector />
        </OptionListItem>
        {restaurants !== null && restaurants.map(restaurant => (
          <div>
            {restaurant.name}
          </div>
        ))
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedAddress: state.address.selectedAddress,
  currentLocation: state.address.currentLocation,
});

RestaurantListPage.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedAddress: PropTypes.number,
  currentLocation: PropTypes.object,
};

export default withStyles(styles)(
  connect(mapStateToProps)(RestaurantListPage),
);
