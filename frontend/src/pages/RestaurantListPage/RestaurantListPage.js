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
      place_id: '',
      tags: [],
      originalList: [],
      changedList: [],
      nameMatchList: [],
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentWillMount() {
    this.loadList();
  }

  loadList() {
    Geocode.fromAddress(DEFAULT_ADDRESS)
    .then(
      res => {
        this.handleSubmit(res.results[0].place_id);
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

  handleSubmit(place_id) {
    axios.get(apiList.restaurants, {
      params: {
        place_id: place_id
      }
    })
    .then(res => {
      if (res.data) {
        console.log(res.data);
        this.setState({
          tags: res.data.categories.map(t => t.name),
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

  handleFilterChange(selectedTags) {
    const { originalList } = this.state;
    this.setState({
      changedList: originalList.filter(item => item.categories.some(t => selectedTags.includes(t))),
    });
  }

  handleSortChange(sortOrder) {
    const { changedList } = this.state;
    this.setState({
      changedList: changedList.sort((o1, o2) => sortOrder(o1, o2)),
    });
  }

  render() {
    const { nameMatchList, tags } = this.state;
    const { classes } = this.props;
    return (
        <div className={classes.paper}>
        <AddressSearchBar onSubmit={this.handleSubmit}></AddressSearchBar>
          <RestaurantFilter
            onFilterChange={this.handleFilterChange}
            onSortChange={this.handleSortChange}
            handleNameChange={this.handleNameChange}
            tags={tags}
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
