import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import apiList from '../../apiList';
import Menu from '../../components/Menu/Menu';
import Cart from '../../components/Cart/Cart';
import RestaurantInfo from '../../components/RestaurantInfo/RestaurantInfo';
import CreateorderCard from '../../components/GrouporderInfo/CreateorderCard';
import ConfirmOrder from '../../components/ConfirmOrder/ConfirmOrder';
const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});


class RestaurantDetailPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.params.id,
      restaurantName: "",
      menu: [],
      cart: {},
      allInfo: {},
      restaurantInfo: {},
      orderId:'',
      creatorId:'',
    };
    this.loadALlInfo = this.loadALlInfo.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.updateCart = this.updateCart.bind(this);
    this.updateCreatorId=this.updateCreatorId.bind(this);
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
      this.setState({
        allInfo: res.data,
        restaurantName: res.data.name,
        menu: res.data.product_categories,
        restaurantInfo: Object.assign({}, res.data, { product_categories: undefined })
      });
      axios.get(apiList.cart)
      .then(res => {
        this.setState({
          cart: res.data,
        })
      })
      .catch(err => {
        const { response } = err;
        if (response) {
          if (response.status === 401) {
            alert("This page requires login to access");
          }
          else {
            console.log(err);
          }
        }
        else {
          console.log(err);
        }
      })
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

  updateCart(cart) {
    axios.put(apiList.cart, cart)
    .then(res => {
      this.setState({
        cart: res.data
      })
    })
    .catch(err => {
      const { response } = err;
      if (response) {
        if (response.status === 401) {
          alert("This page requires login to access");
        }
        else {
          console.log(err);
        }
      }
      else {
        console.log(err);
      }
    })
  }


  updateCreatorId(id){
    alert("updateCreatorId" + id);
    this.setState({creatorId:id});
  }



  addToCart(cartItem) {
    const { id, cart } = this.state;
    console.log(id);
    console.log(cart);
    if (id != cart.restaurant_id && cart.restaurant_id !== null) {
      alert(`There are items from another restaurant in chart. Empty it before adding new item`);
      return;
    }
    if (cart.restaurant_id === null) {
      cart.restaurant_id = Number(id);
    }
    cart.cart.push(cartItem);
    console.log(cart);
    this.updateCart(cart);

  }

  render() {
    const { id, restaurantInfo, menu, cart, restaurantName } = this.state;
    const{classes} = this.props;

    return (
      <div>
        <Grid container  direction="row" justify="space-around">
          <Grid item xs={12} md={3}>
          <RestaurantInfo id={id} restaurantInfo={restaurantInfo}/>
          </Grid>

          <Grid item xs={12} md={5}>
          <Menu menu={menu} addToCart={this.addToCart}/>
          </Grid>

          <Grid item xs={12} md={4}>
          <CreateorderCard updateCreatorid={this.updateCreatorId} restaurant_id={this.state.id}>
          </CreateorderCard>
          <Cart id={id} cart={cart} menu={menu} restaurantName={restaurantName} updateCart={this.updateCart}/>
        
          </Grid>
        </Grid>




      </div>
    )
  }
}

RestaurantDetailPage.propTypes = {
  params: PropTypes.shape({}).isRequired,
};

export default  withStyles(styles)(RestaurantDetailPage);
