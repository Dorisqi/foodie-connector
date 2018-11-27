import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListSubHeader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
import Card from '@material-ui/core/Card';
import Api from 'facades/Api';
import MainContent from 'components/template/MainContent';
import ClearAlert from 'components/cart/ClearAlert';
import ProductOptionSelector from 'components/cart/ProductOptionSelector';
import { cartAddItem } from 'actions/cartActions';
import store from 'store';
import Menu from 'facades/Menu';
import Axios from 'facades/Axios';
import NotFoundPage from 'components/pages/error/NotFoundPage';
import Cart from 'components/cart/Cart';
import Format from 'facades/Format';
import AmountSelector from 'components/cart/AmountSelector';
import RestaurantOrder from 'components/order/RestaurantOrder';
import GroupmemberStatusTable from 'components/order/GroupmemberStatusTable';
import { connect } from 'react-redux';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  subComponent: {
    marginTop: 2 * theme.spacing.unit,
  },
  subComponentTitle: {
    marginBottom: theme.spacing.unit,
  },
  menuCategory: {
    marginBottom: 2 * theme.spacing.unit,
  },
  menuCategoryName: {
    ...theme.typography.h6,
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 1.5 * theme.spacing.unit,
    paddingBottom: 1.5 * theme.spacing.unit,
  },
  productList: {
    width: '100%',
  },
  product: {
    display: 'block',
  },
  productLine: {
    display: 'flex',
  },
  productPrice: {
    flexGrow: 0,
    minWidth: 'fit-content',
    paddingRight: 0,
  },
  productDescription: {
    flexGrow: 1,
    padding: 0,
  },
  amountSelector: {
    paddingTop: 0,
  },
  leftContent: {
    flexGrow: 1,
  },
  rightBar: {
    marginLeft: 50,
    minWidth: 350,
    width: 350,
  },
});

class RestaurantDetailPage extends React.Component {
  state = {
    restaurant: null,
    productMap: null,
    notFound: false,
    loading: null,
    selectingProductOption: null,
    order:null,
  };

  componentDidMount() {
    this.loadRestaurant();
  }

  componentDidUpdate(prevProps, _prevState, _snapshot) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.loadRestaurant();
    }
  }

  componentWillUnmount() {
    Axios.cancelRequest(this.state.loading);
  }

  handleProductClicked = product => () => {
    if (product.product_option_groups.length === 0) {
      this.handleAddItem({
        product_id: product.id,
        product_amount: 1,
        product_price: product.price,
        product_option_groups: [],
      });
    } else {
      this.setState({
        selectingProductOption: product,
      });
    }
  };

  handleProductOptionClose = () => {
    this.setState({
      selectingProductOption: null,
    });
  };

  handleAddItem = (item) => {
    this.setState({
      selectingProductOption: null,
    });
    const { id, name } = this.state.restaurant;
    store.dispatch(cartAddItem(id, name, item));
  };

  handleRestaurantUpdate = (newRestaurant) => {
    const { restaurant } = this.state;
    this.setState({
      restaurant: {
        ...restaurant,
        ...newRestaurant,
      },
    });
  };

  loadRestaurant() {
    Axios.cancelRequest(this.state.loading);
    const id = this.props.match.params.id;
    const { address } = this.props;
    const { selectedAddress, currentLocation } = address;
    let promise = null;
    if (selectedAddress === null) {
      promise = Api.restaurantShow(id);
    } else if (selectedAddress === 0) {
      if (currentLocation === null) {
        promise = Api.restaurantShow(id);
      } else {
        promise = Api.restaurantShow(id, true, null, currentLocation.place_id);
      }
    } else {
      promise = Api.restaurantShow(id, true, selectedAddress);
    }
    this.setState({
      restaurant: null,
      productMap: null,
      notFound: false,
      loading: promise.then((res) => {
        this.setState({
          restaurant: res.data,
          productMap: Menu.generateMap(res.data.restaurant_menu),
          notFound: false,
          loading: null,
        });
      }).catch((err) => {
        this.setState({
          restaurant: null,
          productMap: null,
          loading: null,
          notFound: err.response.status === 404,
        });
        throw err;
      }),
    });
  }

  render() {
    const { classes, cart } = this.props;
    const {
      restaurant,
      productMap,
      loading,
      selectingProductOption,
      notFound,
    } = this.state;
    const cartNeedClear = cart !== null && restaurant !== null
      && cart.restaurantId !== null
      && cart.restaurantId !== restaurant.id;

    return notFound
      ? <NotFoundPage />
      : (
        <MainContent
          title={restaurant === null ? 'Restaurant' : restaurant.name}
          loading={loading !== null}
        >
          {restaurant !== null
          && (
            <div className={classes.root}>
              <div className={classes.leftContent}>
                <div className={classes.subComponent}>
                  <Typography
                    className={classes.subComponentTitle}
                    variant="h5"
                    component="h2"
                  >
                    Restaurant Info
                  </Typography>
                  <Card>
                    <List>
                      <ListItem>
                        <ListItemText
                          primary="Address"
                          secondary={Format.formatAddress(restaurant, true)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Phone"
                          secondary={restaurant.phone}
                        />
                      </ListItem>
                      {restaurant.rating !== null
                      && (
                      <ListItem>
                        <ListItemText
                          primary="Rating"
                          secondary={`${restaurant.rating} / 5`}
                        />
                      </ListItem>
                      )
                      }
                      <ListItem>
                        <ListItemText
                          primary="Delivery Fee"
                          secondary={Format.displayPrice(restaurant.delivery_fee)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Order Minimum"
                          secondary={Format.displayPrice(restaurant.order_minimum)}
                        />
                      </ListItem>
                    </List>
                  </Card>
                </div>
                <div className={classes.subComponent}>
                  <Typography
                    className={classes.subComponentTitle}
                    variant="h5"
                    component="h2"
                  >
                    Menu
                  </Typography>
                  {cart === null
                    ? <LinearProgress />
                    : (
                      <div>
                        {selectingProductOption !== null
                        && (
                          <ProductOptionSelector
                            product={selectingProductOption}
                            onUpdateItem={this.handleAddItem}
                            onClose={this.handleProductOptionClose}
                          />
                        )
                        }
                        {restaurant.restaurant_menu.product_categories.map(productCategory => (
                          <Paper className={classes.menuCategory} key={productCategory.id}>
                            <List
                              key={productCategory.id}
                              className={classes.productList}
                              subheader={(
                                <ListSubHeader className={classes.menuCategoryName} component="h3">
                                  {productCategory.name}
                                </ListSubHeader>
                              )}
                            >
                              <Divider light />
                              {productCategory.products.map((product) => {
                                const cartIndex = cartNeedClear
                                  ? undefined
                                  : cart.cartMap[product.id];
                                return (
                                  <div key={product.id}>
                                    <ListItem
                                      className={classes.product}
                                      button
                                      onClick={this.handleProductClicked(product)}
                                      selected={cartIndex !== undefined}
                                    >
                                      <div className={classes.productLine}>
                                        <ListItemText primary={product.name} />
                                        <ListItemText
                                          className={classes.productPrice}
                                          primary={product.min_price < product.max_price
                                            ? `${Format.displayPrice(product.min_price)} - ${Format.displayPrice(product.max_price)}`
                                            : Format.displayPrice(product.min_price)
                                          }
                                        />
                                      </div>
                                      <ListItemText
                                        className={classes.productDescription}
                                        secondary={product.description}
                                      />
                                    </ListItem>
                                    {cartIndex !== undefined && (
                                      cartIndex === true
                                        ? (
                                          <ListItem
                                            className={classes.amountSelector}
                                            selected
                                          >
                                            <ListItemText
                                              primary="In cart"
                                            />
                                          </ListItem>
                                        )
                                        : (
                                          <ListItem
                                            className={classes.amountSelector}
                                            selected
                                          >
                                            <AmountSelector
                                              cartIndex={cartIndex}
                                              value={cart.cart[cartIndex].product_amount}
                                            />
                                          </ListItem>
                                        )
                                    )
                                    }
                                  </div>
                                );
                              })}
                            </List>
                          </Paper>
                        ))
                        }
                      </div>
                    )}
                </div>
              </div>
              <div className={classes.rightBar}>

                <div className={classes.subComponent}>
                  <Typography
                    className={classes.subComponentTitle}
                    variant="h5"
                    component="h2"
                  >
                    Group Order
                  </Typography>
                  <RestaurantOrder
                    restaurant={restaurant}
                    onRestaurantUpdate={this.handleRestaurantUpdate}
                  />
                </div>
                <div className={classes.subComponent}>
                  <Typography
                    className={classes.subComponentTitle}
                    variant="h5"
                    component="h2"
                  >
                    Group Member
                  </Typography>
                  <GroupmemberStatusTable restaurantId={restaurant.id} />
                </div>
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
              </div>
            </div>
          )
          }
        </MainContent>
      );
  }
}

const mapStateToProps = state => ({
  cart: state.cart,
  address: state.address,
});

RestaurantDetailPage.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  cart: PropTypes.object,
  address: PropTypes.object.isRequired,
};

RestaurantDetailPage.defaultProps = {
  cart: null,
};

export default withStyles(styles)(
  connect(mapStateToProps)(RestaurantDetailPage),
);
