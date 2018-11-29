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
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from 'facades/Menu';
import compose from 'recompose/compose'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Divider from '@material-ui/core/Divider/Divider';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  leftBar: {
    marginLeft: 10,
    minWidth: 350,
    width: 350,
  },
  middleBar: {
    marginLeft: 40,
    minWidth: 350,
    width: 350,
  },
  rightBar: {
    marginLeft: 40,
    minWidth: 350,
    width: 350,
  },
  subComponent: {
    marginTop: 2 * theme.spacing.unit,
  },
  subComponentTitle: {
    marginBottom: theme.spacing.unit,
  },
  itemLine: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
  actions: {
    display: 'block',
  },
});



class CheckOutPage extends React.Component {
  state = {
    restaurantId: 0,
    restaurant: null,
    cart: [],
    subtotal: 0,
    productMap: null,
    loading: null,
    selectedCard: 0,
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
    })
  };
  handlePayment = () => {
    this.props.history.push({
      pathname: `/orders/${this.props.location.state.order.id}/pay`,
      state: {order: this.props.location.state.order}
    });
  };

  render() {
    const { classes , cart} = this.props;
    const {restaurant, productMap} = this.state;
    return (
      <MainContent title="Review & Pay">
        <div className={classes.root}>
          <div className={classes.leftBar}>
            <div className={classes.subComponent}>
              <Typography
                className={classes.subComponentTitle}
                variant="h5"
                component="h2"
              >
                ORDER SUMMARY
              </Typography>
              <CartCheckout restaurant={restaurant} cart={cart} productMap={productMap} order={this.props.location.state.order} />
            </div>
          </div>
          <div className={classes.middleBar}>
            <div className={classes.subComponent}>

              <Typography
                className={classes.subComponentTitle}
                variant="h5"
                component="h2"
              >
                INFO
              </Typography>
              <Paper>
                <ListItem>
                  <ListItemText
                    primary="Delivery Address"
                    secondary={
                      <span>
                         {this.props.location.state.order.creator.name}
                         <br />
                         {this.props.location.state.order.address_line_2}
                         <br />
                         {this.props.location.state.order.address_line_1}
                         <br />
                         {this.props.location.state.order.city}
                         <br />
                         {this.props.location.state.order.phone}
                      </span>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Contact Restaurant"
                    secondary={
                      <span>
                         {this.props.location.state.order.restaurant.name}
                         <br />
                         {this.props.location.state.order.restaurant.address_line_2}
                         <br />
                         {this.props.location.state.order.restaurant.address_line_1}
                         <br />
                         {this.props.location.state.order.city}
                         <br />
                         {this.props.location.state.order.restaurant.phone}
                      </span>
                    }
                  />
                </ListItem>

              </Paper>
            </div>
          </div>
          <div className={classes.rightBar}>
            <div className={classes.subComponent}>
              <Typography
                className={classes.subComponentTitle}
                variant="h5"
                component="h2"
              >
                PAYMENT METHOD
              </Typography>
              <CardSelector />
            </div>
            <div className={classes.subComponent}>
              <Button
                className={classes.action}
                variant="outlined"
                color="primary"
                onClick = {this.handlePayment}
                fullWidth
              >
                Pay
              </Button>
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

CheckOutPage.propTypes = {
  classes: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(withRouter(CheckOutPage))
