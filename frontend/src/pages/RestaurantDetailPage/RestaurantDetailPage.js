import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import apiList from '../../apiList';
import Menu from '../../components/Menu/Menu';
import Cart from '../../components/Cart/Cart';
import RestaurantInfo from '../../components/RestaurantInfo/RestaurantInfo';

class RestaurantDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.params.id,
      menu: [],
      cartItems: [],
      allInfo: {},
      restaurantInfo: {},
    };
    this.loadALlInfo = this.loadALlInfo.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.updateCart = this.updateCart.bind(this);
  }

  componentWillMount() {
    this.loadALlInfo();
  }

  loadALlInfo() {
    const { id } = this.state;
    axios.get(apiList.restaurant(id), {
      params: { with_menu: true },
    })
    .then(res => {
      console.log(res);
      this.setState({
        allInfo: res.data,
        menu: res.data.product_categories,
        restaurantInfo: Object.assign({}, res.data, { product_categories: undefined })
      });
    })
    .catch(err => {
      const { response } = err;
      if (response) {
        if (response.status === 404) {
          alert(`This restaurant(${id}) does not exist.`);
        }
        else if (response.status === 401) {
          alert("This page requires login to access");
        }
        else {
          console.log(err);
        }
      }
      else {
        console.log(err);
      }
    });
  }

  updateCart(cartItems) {
    this.setState({
      cartItems: cartItems
    })
  }

  addToCart(name) {
    // this.setState((state) => {
    //   const { cartItems } = state;
    //   const res = cartItems.find(item => item.name === name);
    //   if (res) {
    //     console.log("find item in cart");
    //     res.count++;
    //     console.log(cartItems);
    //     return { cartItems: cartItems };
    //   }
    //   else {
    //     console.log("not find item in cart");
    //     const newItemPrice = state.menu.find(item => item.name === name).price;
    //     const newItem = {
    //       name: name,
    //       price: newItemPrice,
    //       count: 1,
    //     };
    //     console.log([...cartItems, newItem]);
    //     return { cartItems: [...cartItems, newItem]};
    //   }
    // })
  }

  render() {
    const { id, restaurantInfo, menu, cartItems } = this.state;
    return (
      <div>
        <Grid container spacing={16}>
          <RestaurantInfo id={id} restaurantInfo={restaurantInfo}/>
          <Menu menu={menu} addToCart={this.addToCart}/>
          <Cart id={id} cartItems={cartItems} updateCart={this.updateCart}/>
        </Grid>
      </div>
    )
  }
}

RestaurantDetailPage.propTypes = {
  params: PropTypes.shape({}).isRequired,
};

export default RestaurantDetailPage;
