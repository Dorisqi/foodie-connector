import React from 'react';
import RestaurantList from '../../components/RestaurantList/RestaurantList';
import RestaurantFilter from '../../components/RestaurantFilter/RestaurantFilter';

const mockRestaurantList = [
  {
    id: 1,
    name: 'ColdBox Pizza',
    distance: 4.5,
    delivery_fee: 3.99,
    order_minimum: 20,
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
    delivery_fee: 3.99,
    order_minimum: 20,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 80,
    tags: [
      'Pizza', 'Fast Food', 'Wings',
    ],
    image: '/images/1.jpg',
  }, {
    id: 3,
    name: 'Pizza House',
    distance: 10,
    delivery_fee: 3.99,
    order_minimum: 20,
    estimate_time_lo: 20,
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
    delivery_fee: 3.99,
    order_minimum: 20,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 96,
    tags: [
      'Chinese', 'Fast Food',
    ],
    image: '/images/1.jpg',
  }, {
    id: 5,
    name: 'Thai food',
    distance: 4.5,
    delivery_fee: 3.99,
    order_minimum: 20,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 96,
    tags: [
      'Thai', 'Fast Food',
    ],
    image: '/images/1.jpg',
  }, {
    id: 6,
    name: 'Mexican food',
    distance: 4.5,
    delivery_fee: 3.99,
    order_minimum: 20,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 96,
    tags: [
      'Mexican', 'Fast Food',
    ],
    image: '/images/1.jpg',
  },
];

class RestaurantListPage extends React.Component {
  constructor() {
    super();
    this.state = {
      originalList: [],
      changedList: [],
    };
    this.handleFilterChange = this.handleFilterChange.bind(this);
  }

  componentWillMount() {
    this.loadList();
  }

  loadList() {
    this.setState({
      originalList: mockRestaurantList.slice(),
      changedList: mockRestaurantList.slice(),
    });
  }

  handleFilterChange(selectedTags) {
    const { originalList } = this.state;
    this.setState({
      changedList: originalList.filter(item => item.tags.some(t => selectedTags.includes(t)))
    });
  }

  render() {
    const { changedList } = this.state;
    return (
      <div>
        <RestaurantFilter onFilterChange={this.handleFilterChange} />
        <RestaurantList restaurantList={changedList} />
      </div>
    );
  }
}

export default RestaurantListPage;
