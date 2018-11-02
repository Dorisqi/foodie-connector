import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import RestaurantList from '../../components/RestaurantList/RestaurantList';
import RestaurantFilter from '../../components/RestaurantFilter/RestaurantFilter';
import apiList from '../../apiList';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import AddressSearchBar from '../../components/RestaurantFilter/AddressSearchBar';
import Geocode from 'react-geocode';

const DEFAULT_ADDRESS = 'Purdue Memorial Union';

const styles = theme =>({
  paper: {
    marginTop: theme.spacing.unit *1,
    display: 'flex',
    flexDirection: 'column',

  },

});

class RestaurantListPage extends React.Component {
  constructor() {
    super();
    this.state = {
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
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleOtherFilter = this.handleOtherFilter.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
  }

  componentWillMount() {
    this.loadList();
  }

  loadList() {
    Geocode.fromAddress(DEFAULT_ADDRESS)
    .then(
      res => {
        const { place_id } = res.results[0];
        axios.get(apiList.restaurants, {
          params: { place_id: place_id }
        })
        .then(res2 => {
          if (res2.data) {
            this.setState({
              address: DEFAULT_ADDRESS,
              place_id: place_id,
              tags: res2.data.categories.slice(),
              originalList: res2.data.restaurants.slice(),
              changedList: res2.data.restaurants.slice(),
              nameMatchList: res2.data.restaurants.slice(),
            });
          }
          else {
            console.log(res2);
          }
        })
        .catch(err => {
          console.log(err);
        });
      }
    , err => {
        console.log(err)
      }
    )
  }

  handleNameChange(name) {
    const { changedList } = this.state;
    this.setState({
      nameMatchList: changedList.filter(item => item.name.toLowerCase().indexOf(name.toLowerCase()) != -1)
    })
  }
  getParams() {
    const { place_id,
            tag_ids,
            filter_distance,
            filter_estimated_delivery_time,
            filter_delivery_fee,
            filter_order_minimum,
            filter_rating,
          } = this.state;

    const params = {
      place_id: place_id,
    }
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

  handleSubmit(address='') {
    if (address === '') {
      address = this.state.address;
    }
    Geocode.fromAddress(address)
    .then(
      res => {
        this.getRestaurants(res.results[0].place_id);
      }
    , err => {
        console.log(err)
      }
    )
    //event.preventDefault();
  }
  getRestaurants(place_id) {
    const params = this.getParams();
    axios.get(apiList.restaurants, {
      params: params
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
    })
  }

  handleOtherFilter(filters) {
    this.setState({
        filter_distance: filters.distanceLo+'_'+filters.distanceHi,
        filter_estimated_delivery_time: filters.deliveryTimeLo+'_'+filters.deliveryTimeHi,
        filter_delivery_fee: filters.deliveryFeeLo+'_'+filters.deliveryFeeHi,
        filter_order_minimum: filters.orderMinLo+'_'+filters.orderMinHi,
        filter_rating: filters.ratingLo+'_'+filters.ratingHi,
      }, () => this.handleSubmit());
  }

  handleFilterChange(selectedTags) {
    var tag_ids = '';

    for (var i = 0; i < selectedTags.length; i++) {
      if (selectedTags[i].name !== 'All') {
        tag_ids += '_'+selectedTags[i].id;
      }
    }
    if (tag_ids !== '') {
      tag_ids = tag_ids.slice(1, tag_ids.length);
    }
    this.setState({
      tag_ids: tag_ids
    })
  }

  handleSortChange(sortOrder) {
    const { nameMatchList } = this.state;
    if (sortOrder === 'default') {
      this.setState({
        changedList: nameMatchList
      })
    }
    else if (sortOrder === 'rating') {
      this.setState({
        changedList: nameMatchList.concat().sort((o1, o2) => o2.rating - o1.rating),
      })
    }
    else {
      this.setState({
        changedList: nameMatchList.concat().sort((o1, o2) => o1[sortOrder] - o2[sortOrder]),
      })
    }
  }

  handleAddressChange(address) {
    this.setState({ address: address });
  }

  render() {
    const { nameMatchList, tags } = this.state;
    const { classes } = this.props;
    return (
        <div className={classes.paper}>
        <AddressSearchBar handleAddressChange={this.handleAddressChange}></AddressSearchBar>
          <RestaurantFilter
            onFilterChange={this.handleFilterChange}
            onSortChange={this.handleSortChange}
            handleNameChange={this.handleNameChange}
            tags={tags}
            handleOtherFilter={this.handleOtherFilter}
          />

          <RestaurantList restaurantList={nameMatchList} />
        </div>

    );
  }
}

RestaurantListPage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(RestaurantListPage);
