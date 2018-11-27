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
import Cart from 'components/cart/Cart';
import Menu from 'facades/Menu';


const styles = theme => ({
  margin: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  visibilityGroup: {
    flexDirection: 'row',
  },
  visibilityRadio: {
    marginRight: 5 * theme.spacing.unit,
  },
  cancelButton: {
    borderColor: theme.palette.error.light,
    color: theme.palette.error.main,
  },
  actions: {
    display: 'block',
  },
  action: {
    marginBottom: theme.spacing.unit,
  },
  errorText: {
    color: theme.palette.error.main,
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
        <MainContent title="Order Detail">
          <div className={classes.subComponent}>
            <Typography
              className={classes.subComponentTitle}
              variant="h5"
              component="h2"
            >
              Cart
            </Typography>
            {cart !== null
            && <ClearAlert />
            }
            <Cart restaurant={restaurant} productMap={productMap} />
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
