import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux';
import { cartUpdate, cartClear, cartUpdateItem } from 'actions/cartActions';
import store from 'store';
import Format from 'facades/Format';
import Api from 'facades/Api';
import Axios from 'facades/Axios';
import compose from 'recompose/compose';
import { Link, withRouter } from 'react-router-dom';
import ProductOptionSelector from './ProductOptionSelector';
import AmountSelector from './AmountSelector';

const styles = theme => ({
  loading: {
    paddingTop: 2 * theme.spacing.unit,
    paddingBottom: 2 * theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  clearCartAlert: {
    paddingBottom: 0,
  },
  emptyCart: {
    textAlign: 'center',
  },
  item: {
    display: 'block',
  },
  itemLine: {
    display: 'flex',
    alignItems: 'flex-start',
    width: '100%',
  },
  productPrice: {
    flexGrow: 0,
    paddingRight: 0,
    minWidth: 'fit-content',
  },
  option: {
    maxHeight: 21,
    overflow: 'hidden',
    padding: 0,
  },
  itemOptions: {
    flexGrow: 1,
  },
  amountSelector: {
    minWidth: 'fit-content',
  },
  summaryPrice: {
    textAlign: 'right',
    padding: 0,
  },
});

class Cart extends React.Component {
  state = {
    loading: null,
    updatingItemIndex: null,
    orderId: null,
  };

  componentDidMount() {
    const { cart } = this.props;
    if (cart === null) {
      this.setState({
        loading: Api.cartShow().then((res) => {
          store.dispatch(cartUpdate(res.data));
          this.setState({
            loading: null,
          });
        }).catch((err) => {
          this.setState({
            loading: null,
          });
          throw err;
        }),
      });
    }
  }

  componentWillUnmount() {
    Axios.cancelRequest(this.state.loading);
  }

  handleClearClick = () => {
    store.dispatch(cartClear());
  };

  handleItemClick = index => () => {
    this.setState({
      updatingItemIndex: index,
    });
  };

  handleOptionSelectorClose = () => {
    this.setState({
      updatingItemIndex: null,
    });
  };

  handleItemUpdate = index => (item) => {
    this.setState({
      updatingItemIndex: null,
    });
    store.dispatch(cartUpdateItem(index, item));
  };

  handleDirectCheckout = () => {
    const {cart, productMap,restaurant, address} = this.props;
    this.setState({
      loading: Api.orderDirectCheckout(restaurant.id, address.selectedAddress).then((res) => {
        console.log(res.data.delivery_fee);
        console.log(res.data.tax)
        const { history } = this.props;
        history.push({
          pathname: `/orders/direct-checkout`,
          state: {
            restaurant: restaurant,
            cart: cart,
            productMap: productMap,
            sutotal: res.data.subtotal,
            tax: res.data.tax,
            delivery_fee: res.data.delivery_fee,
          },
        });
      }).catch((err) => {
        throw err;
      }),
    });
  };

  render() {
    const {
      classes, restaurant, cart, productMap, address
    } = this.props;
    const { updatingItemIndex, orderId } = this.state;
    if (restaurant === null || cart === null) {
      return (
        <LinearProgress />
      );
    }
    return cart.restaurantId !== null && cart.restaurantId !== restaurant.id
      ? (
        <Card>
          <CardContent className={classes.clearCartAlert}>
            <Typography component="p">
              You have items from another restaurant
              (
              <Link to={`/restaurants/${cart.restaurantId}`}>{cart.restaurantName}</Link>
              ).
              Please clear the cart before adding items.
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={this.handleClearClick} size="small" color="primary">
              Clear
            </Button>
          </CardActions>
        </Card>
      )
      : (
        <Paper>
          {updatingItemIndex !== null
            && (
            <ProductOptionSelector
              cartItem={cart.cart[updatingItemIndex]}
              product={productMap[cart.cart[updatingItemIndex].product_id]}
              onUpdateItem={this.handleItemUpdate(updatingItemIndex)}
              onClose={this.handleOptionSelectorClose}
            />
            )
          }
          <List>
            {cart.cart.length === 0
            && (
            <ListItem>
              <ListItemText
                className={classes.emptyCart}
                primary="There is no item in the cart"
              />
            </ListItem>
            )
            }
            {cart.cart.map((cartItem, index) => {
              const product = productMap[cartItem.product_id];
              return (
                <ListItem
                  button
                  key={index} // eslint-disable-line react/no-array-index-key
                  className={classes.item}
                  onClick={this.handleItemClick(index)}
                >
                  <div className={classes.itemLine}>
                    <ListItemText
                      primary={product.name}
                    />
                    <ListItemText
                      className={classes.productPrice}
                      primary={Format.displayPrice(cartItem.product_price)}
                    />
                  </div>
                  <div className={classes.itemLine}>
                    <div className={classes.itemOptions}>
                      {cartItem.product_option_groups.map((itemOptionGroup) => {
                        const optionGroup = product.product_option_group_map[
                          itemOptionGroup.product_option_group_id
                        ];
                        return (
                          <ListItemText
                            key={itemOptionGroup.product_option_group_id}
                            className={classes.option}
                            secondary={itemOptionGroup.product_options.map(optionId => optionGroup.product_option_map[optionId].name).join(', ')}
                          />
                        );
                      })
                        }
                    </div>
                    <AmountSelector
                      className={classes.amountSelector}
                      value={cartItem.product_amount}
                      cartIndex={index}
                    />
                  </div>
                </ListItem>
              );
            })}
            <ListItem>
              <ListItemText
                className={classes.summaryPrice}
                primary={`Subtotal: ${Format.displayPrice(cart.subtotal)}`}
                primaryTypographyProps={{
                  variant: 'h6',
                }}
              />
            </ListItem>
            <ListItem>
              <Button
                variant="outlined"
                disabled={cart.cart.length === 0}
                color="primary"
                fullWidth
                onClick={this.handleDirectCheckout}
              >
                Direct Checkout
              </Button>
            </ListItem>
          </List>
        </Paper>
      );
  }
}

const mapStateToProps = state => ({
  cart: state.cart,
  orderId: state.orderId,
  address: state.address,

});

Cart.propTypes = {
  classes: PropTypes.object.isRequired,
  restaurant: PropTypes.object,
  productMap: PropTypes.object,
  cart: PropTypes.object,

};

Cart.defaultProps = {
  restaurant: null,
  productMap: null,
  cart: null,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps),
)(withRouter(Cart));
