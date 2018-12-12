import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux';
import { cartUpdate, cartClear } from 'actions/cartActions';
import store from 'store';
import Format from 'facades/Format';
import Axios from 'facades/Axios';
import Api from 'facades/Api';


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
  summaryPrice: {
    textAlign: 'left',
    padding: 0,
  },
  optionDivider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class CartCheckout extends React.Component {
  state = {
    loading: null,
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

  render() {
    const {
      classes, restaurant, cart, productMap,
    } = this.props;
    if (restaurant === null || cart === null) {
      return (
        <LinearProgress />
      );
    }
    return (
      <Paper>
        <List>
          {cart.cart.map((cartItem) => {
            const product = productMap[cartItem.product_id];
            return (
              <ListItem>
                <div className={classes.itemLine}>
                  <ListItemText
                    primary={product.name}
                    secondary={`X ${cartItem.product_amount}`}
                  />
                  <ListItemText
                    className={classes.productPrice}
                    primary={Format.displayPrice(cartItem.product_price)}
                  />
                </div>
              </ListItem>
            );
          })}
        </List>
      </Paper>

    );
  }
}

const mapStateToProps = state => ({
  cart: state.cart,
});

CartCheckout.propTypes = {
  classes: PropTypes.object.isRequired,
  restaurant: PropTypes.object.isRequired,
  productMap: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
};


export default withStyles(styles)(
  connect(mapStateToProps)(CartCheckout),
);
