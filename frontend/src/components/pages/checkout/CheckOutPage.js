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
import Menu from 'facades/Menu';
import compose from 'recompose/compose'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Format from 'facades/Format';
import Divider from '@material-ui/core/Divider/Divider';
import TextField from '@material-ui/core/TextField';

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
  actions: {
    display: 'block',
  },
  tip: {
    marginLeft: 40,
    width: 250,
  },
});



class CheckOutPage extends React.Component {
  state = {
    restaurantId: 0,
    restaurant: null,
    cart: [],
    tax: 0,
    delivery_fee: 0,
    subtotal: 0,
    productMap: null,
    loading: null,
    selectedCardId: 0,
    tip: null,
  }
  componentDidMount() {
    this.handleShowCart();
    this.handleCheckout();
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
    const {tip, selectedCardId} = this.state;
    Api.orderPay(this.props.location.state.order.id, tip, selectedCardId).then((res) => {
      console.log(res.data);
    }).catch((err) => {
      throw err;
    })
  };
  handleCardId = (e) => {
    this.setState({
      selectedCardId: e,
    });
  }

  handleCheckout = () => {
    Api.orderCheckout(this.props.location.state.order.id).then((res) => {
      this.setState({
          tax: res.data.tax,
          delivery_fee: res.data.delivery_fee,
      });
    }).catch((err) => {
      throw err;
    })
  }

  handleSetTip = (event) =>{
    this.setState({
      tip: event.target.value,
    });
  };
  render() {
    const { classes , cart} = this.props;
    const {restaurant, productMap,
          selectedCardId, tax, subtotal,
          delivery_fee, tip} = this.state;
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
              <CartCheckout restaurant={restaurant}
                            cart={cart}
                            productMap={productMap}
                            order={this.props.location.state.order}
                            tax={tax}
                            delivery_fee={delivery_fee}
              />
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
                TOTAL
              </Typography>
              <Paper>
              <List>
                <ListItem>
                <ListItemText
                  className={classes.summaryPrice}
                  primary={`Subtotal: ${Format.displayPrice(subtotal)}`}
                />
                </ListItem>
                <ListItem>
                <ListItemText
                  className={classes.summaryPrice}
                  primary={`Delivery Fee: ${Format.displayPrice(delivery_fee)}`}
                />
                </ListItem>
                <ListItem>
                <ListItemText
                  className={classes.summaryPrice}
                  primary={`Tax: ${Format.displayPrice(tax)}`}
                />
                </ListItem>
              </List>
              <TextField
                className = {classes.tip}
                variant="standard"
                label="tip"
                margin="normal"
                onChange={this.handleSetTip}
              >
              </TextField>
              <CardSelector
                  onSelect={this.handleCardId}
              />
              <br />
              </Paper>
            </div>
            <div className={classes.subComponent}>
              <Button
                className={classes.action}
                variant="outlined"
                color="primary"
                disabled={selectedCardId === 0 || tip === null }
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
