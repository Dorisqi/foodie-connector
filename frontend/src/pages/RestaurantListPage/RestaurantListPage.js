import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import RestaurantList from '../../components/RestaurantList/RestaurantList';
import RestaurantFilter from '../../components/RestaurantFilter/RestaurantFilter';

const mockRestaurantList = [
  {
    id: 1,
    name: 'ColdBox Pizza',
    distance: 4.5,
    delivery_fee: 3.99,
    order_minimum: 9,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 96,
    tags: [
      'Pizza', 'Fast Food', 'Wings',
    ],
    image: '/images/1.jpg',
  }, {
    id: 2,
    name: 'Mad Carrot Pizza',
    distance: 5,
    delivery_fee: 2,
    order_minimum: 12,
    estimate_time_lo: 15,
    estimate_time_hi: 30,
    rate: 80,
    tags: [
      'Pizza', 'Fast Food', 'Wings',
    ],
    image: '/images/1.jpg',
  }, {
    id: 3,
    name: 'Pizza House',
    distance: 3,
    delivery_fee: 2.5,
    order_minimum: 18,
    estimate_time_lo: 10,
    estimate_time_hi: 30,
    rate: 100,
    tags: [
      'Pizza', 'Fast Food', 'Wings',
    ],
    image: '/images/1.jpg',
  }, {
    id: 4,
    name: 'Chinese food',
    distance: 2.4,
    delivery_fee: 5.99,
    order_minimum: 14,
    estimate_time_lo: 14,
    estimate_time_hi: 30,
    rate: 67,
    tags: [
      'Chinese', 'Fast Food',
    ],
    image: '/images/1.jpg',
  }, {
    id: 5,
    name: 'Thai food',
    distance: 7.8,
    delivery_fee: 4.99,
    order_minimum: 15,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 86,
    tags: [
      'Thai', 'Fast Food',
    ],
    image: '/images/1.jpg',
  }, {
    id: 6,
    name: 'Mexican food',
    distance: 9.1,
    delivery_fee: 1.5,
    order_minimum: 20,
    estimate_time_lo: 30,
    estimate_time_hi: 40,
    rate: 60,
    tags: [
      'Mexican', 'Fast Food',
    ],
    image: '/images/1.jpg',
  },
];

const styles = ({

});

class RestaurantListPage extends React.Component {
  constructor() {
    super();
    this.state = {
      address: '',
      originalList: [],
      changedList: [],
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    this.loadList();
  }

  loadList() {
    const { address } = this.state;
    console.log(address);
    this.setState({
      originalList: mockRestaurantList.slice(),
      changedList: mockRestaurantList.slice(),
    });
  }

  handleSubmit(address) {
    this.setState({
      address,
    });
  }

  handleFilterChange(selectedTags) {
    const { originalList } = this.state;
    this.setState({
      changedList: originalList.filter(item => item.tags.some(t => selectedTags.includes(t))),
    });
  }

  handleSortChange(sortOrder) {
    const { changedList } = this.state;
    this.setState({
      changedList: changedList.sort((o1, o2) => sortOrder(o1, o2)),
    });
  }

  render() {
    const { changedList } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <RestaurantFilter
          onSubmit={this.handleSubmit}
          onFilterChange={this.handleFilterChange}
          onSortChange={this.handleSortChange}
        />
        <RestaurantList restaurantList={changedList} />
      </div>
    );
  }
}

RestaurantListPage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(RestaurantListPage);
