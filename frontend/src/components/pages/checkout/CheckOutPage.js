import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import MainContent from 'components/template/MainContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Api from 'facades/Api';
import Button from '@material-ui/core/Button';
import CartCheckout from 'components/cart/CartCheckout';
import CardSelector from 'components/card/CardSelector';
import ListItem from '@material-ui/core/ListItem';
import Menu from 'facades/Menu';
import compose from 'recompose/compose';
import { withRouter } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Format from 'facades/Format';
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
    restaurant: null,
    tax: 0,
    deliveryFee: 0,
    subtotal: 0,
    productMap: null,
    selectedCardId: null,
    tip: null,
    total: null,
  }

  componentDidMount() {
    this.handleShowCart();
    this.handleCheckout();
  }

  handleShowCart = () => {
    Api.cartShow().then((res) => {
      let promise = null;
      promise = Api.restaurantShow(res.data.restaurant.id);
      promise.then((res1) => {
        this.setState({
          productMap: Menu.generateMap(res1.data.restaurant_menu),
          restaurant: res.data.restaurant,
          subtotal: res.data.subtotal,
        });
      }).catch((err) => {
        throw err;
      });
    });
  };

  handlePayment = () => {
    const { history } = this.props;
    history.push({
      pathname: `/orders/${this.props.location.state.order.id}/pay`,
      state: {
        orderId: this.props.location.state.order.id,
        card_id: this.state.selectedCardId,
      },
    });
  };

  handleCardId = (e) => {
    this.setState({
      selectedCardId: e,

    });
    if (this.state.tip !== null) {
      Api.orderPay(this.props.location.state.order.id, this.state.tip, e).then((res) => {
        this.setState({
          total: res.data.total,
        });
      }).catch((err) => {
        throw err;
      });
    }
  }

  handleCheckout = () => {
    Api.orderCheckout(this.props.location.state.order.id).then((res) => {
      this.setState({
        tax: res.data.tax,
        deliveryFee: res.data.delivery_fee,
      });
    }).catch((err) => {
      throw err;
    });
  }

  handleSetTip = (event) => {
    this.setState({
      tip: event.target.value,

    });

    if (this.state.selectedCardId !== null) {
      Api.orderPay(this.props.location.state.order.id,
        event.target.value, this.state.selectedCardId).then((res) => {
        this.setState({
          total: res.data.total,
        });
      }).catch((err) => {
        throw err;
      });
    }
  };


  render() {
    const { classes } = this.props;
    const { cart } = this.state;
    const {
      restaurant, productMap,
      selectedCardId, tax, subtotal,
      deliveryFee, tip, total,
    } = this.state;
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
              <CartCheckout
                restaurant={restaurant}
                cart={cart}
                productMap={productMap}
                order={this.props.location.state.order}
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
                    secondary={(
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
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Contact Restaurant"
                    secondary={(
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
                    )}
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
                      primary={`Delivery Fee: ${Format.displayPrice(deliveryFee)}`}
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
                  className={classes.tip}
                  variant="standard"
                  label="tip"
                  margin="normal"
                  onChange={this.handleSetTip}
                />
                <CardSelector
                  onSelect={this.handleCardId}
                />
                <br />
                {tip !== undefined && selectedCardId !== null
                  && (
                    <ListItem>
                      <ListItemText
                        className={classes.summaryPrice}
                        primary={`Total: ${Format.displayPrice(total)}`}
                        primaryTypographyProps={{
                          variant: 'h6',
                        }}
                      />
                    </ListItem>
                  )
                }
              </Paper>
            </div>
            <div className={classes.subComponent}>
              <Button
                className={classes.action}
                variant="outlined"
                color="primary"
                disabled={selectedCardId === 0 || tip === null}
                onClick={this.handlePayment}
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
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps),
)(withRouter(CheckOutPage));
