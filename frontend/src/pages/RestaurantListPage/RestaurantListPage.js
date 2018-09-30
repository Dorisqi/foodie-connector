import React from 'react';
import RestaurantList from '../../components/RestaurantList/RestaurantList';

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
    tags: ['Pizza', 'FastFood', 'Wings'],
    image: '/images/1.jpg',
  },
  {
    id: 2,
    name: 'Mad Carrot Pizza',
    distance: 5,
    delivery_fee: 3.99,
    order_minimum: 20,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 80,
    tags: ['Pizza', 'FastFood', 'Wings'],
    image: '/images/1.jpg',
  },
  {
    id: 3,
    name: 'Pizza House',
    distance: 10,
    delivery_fee: 3.99,
    order_minimum: 20,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 100,
    tags: ['Pizza', 'FastFood', 'Wings'],
    image: '/images/1.jpg',
  },
  {
    id: 4,
    name: 'Chinese food',
    distance: 2.4,
    delivery_fee: 3.99,
    order_minimum: 20,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 96,
    tags: ['Chinese', 'FastFood'],
    image: '/images/1.jpg',
  },
  {
    id: 5,
    name: 'Thai food',
    distance: 4.5,
    delivery_fee: 3.99,
    order_minimum: 20,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 96,
    tags: ['Thai', 'FastFood'],
    image: '/images/1.jpg',
  },
  {
    id: 6,
    name: 'Mexican food',
    distance: 4.5,
    delivery_fee: 3.99,
    order_minimum: 20,
    estimate_time_lo: 20,
    estimate_time_hi: 30,
    rate: 96,
    tags: ['Mexican', 'FastFood'],
    image: '/images/1.jpg',
  },
];

class RestaurantListPage extends React.Component {
  constructor() {
    super();
    this.state = { restaurantList: [] };
  }

  componentDidMount() {
    this.loadList();
  }

  loadList() {
    this.setState({ restaurantList: mockRestaurantList });
  }

  renderRestaurants() {
    const { restaurantList } = this.state;
    return (
      <RestaurantList restaurantList={restaurantList} />
    );
  }

  render() {
    return (
      <div>
        {this.renderRestaurants()}
      </div>
    );
  }
}

export default RestaurantListPage;
