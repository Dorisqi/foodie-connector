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
import { Link } from 'react-router-dom';
import { cartUpdate, cartClear, cartUpdateItem } from 'actions/cartActions';
import store from 'store';
import Format from 'facades/Format';
import Api from 'facades/Api';
import Axios from 'facades/Axios';
import Divider from '@material-ui/core/Divider/Divider';


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
    updatingItemIndex: null,
  };

  componentDidMount() {
    const { cart, order } = this.props;
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
      classes, restaurant, cart, productMap, order
    } = this.props;
    const { updatingItemIndex } = this.state;
    if (restaurant === null || cart === null) {
      return (
        <LinearProgress />
      );
    }
    return (
      <Paper>
        <List>
          {cart.cart.map((cartItem, index) => {
            const product = productMap[cartItem.product_id];
            return (
              <ListItem>
                <div className={classes.itemLine}>
                  <ListItemText
                    primary={product.name}
                  />
                  <ListItemText
                    className={classes.productPrice}
                    primary={Format.displayPrice(cartItem.product_price)}
                  />
                </div>
              </ListItem>
            );
          })}
          <Divider className={classes.optionDivider} light />
          <ListItem>
            <ListItemText
              className={classes.summaryPrice}
              primary={`Subtotal: ${Format.displayPrice(cart.subtotal)}`}
              primaryTypographyProps={{
                variant: 'h6',
              }}
            />
          </ListItem>
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
  order: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired,
};

CartCheckout.defaultProps = {
  restaurant: null,
  productMap: null,
  cart: null,

};

export default withStyles(styles)(
  connect(mapStateToProps)(CartCheckout),
);
