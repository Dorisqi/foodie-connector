import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MainContent from 'components/template/MainContent';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Paper from '@material-ui/core/Paper';
import ClearAlert from 'components/cart/ClearAlert';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Axios from 'facades/Axios';
import Api from 'facades/Api';
import Button from '@material-ui/core/Button';
import CartCheckout from 'components/cart/CartCheckout';
import CardSelector from 'components/card/CardSelector';
import Menu from 'facades/Menu';


const styles = theme => ({
  root: {
    display: 'flex',
  },
  rightBar: {
    marginLeft: 10,
    minWidth: 350,
    width: 350,
  },
  middleBar: {
    marginLeft: 60,
    minWidth: 350,
    width: 350,
  },
  subComponent: {
    marginTop: 2 * theme.spacing.unit,
  },
  subComponentTitle: {
    marginBottom: theme.spacing.unit,
  },
});


class CheckoutPage extends React.Component {
  state = {
    restaurantId: 0,
    restaurant: null,
    cart: [],
    subtotal: 0,
    productMap: null,
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.handleShowCart();
  }

  handleShowCart = () =>{
    Api.cartShow().then((res) => {
      let promise = null;
      promise = Api.restaurantShow(res.data.restaurant.id);
      promise.then((res1) => {
        this.setState({
          productMap: Menu.generateMap(res1.data.restaurant_menu),
          restaurant: res.data.restaurant,
          cart: res.data.cart,
          subtotal: res.data.subtotal,
        });
      }).catch((err) => {
        throw err;
      });
    console.log(this.state.productMap);
  })
};

  render() {
    const { classes, cart } = this.props;
    const {restaurant, productMap} = this.state;
    return(
        <MainContent title="Review & Pay">
        <div className={classes.root}>
          <div className={classes.rightBar}>
            <div className={classes.subComponent}>
              <Typography
                className={classes.subComponentTitle}
                variant="h5"
                component="h2"
              >
                ORDER SUMMARY
              </Typography>
              {cart !== null
              && <ClearAlert />
              }
              <CartCheckout restaurant={restaurant} productMap={productMap} />
            </div>
          </div>
          <div className={classes.middleBar}>
            <div className={classes.subComponent}>
              <Typography
                className={classes.subComponentTitle}
                variant="h5"
                component="h2"
              >
                Payment Method
              </Typography>
              <CardSelector />
            </div>
          </div>
          </div>
        </MainContent>
      );
  }
}

const mapStateToProps = state => ({
  cart: state.cart,
  address: state.address,
  restaurant: state.restaurant,
});

CheckoutPage.propTypes = {
  classes: PropTypes.object.isRequired,
  cart: PropTypes.object,
  address: PropTypes.object.isRequired,
  restaurant: PropTypes.object.isRequired,
};

export default withStyles(styles)(
  connect(mapStateToProps)(CheckoutPage),
);
