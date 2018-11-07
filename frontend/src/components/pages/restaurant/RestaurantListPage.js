import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import ExpandMore from '@material-ui/icons/ExpandMore';
import LineProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider/Divider';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import lodash from 'lodash';
import { Map } from 'immutable';
import Api from 'facades/Api';
import RestaurantListItem from 'components/restaurant/RestaurantListItem';
import AddressSelector from 'components/address/AddressSelector';
import OptionListItem from 'components/restaurant/OptionListItem';
import NumericFilter from 'components/restaurant/NumericFilter';
import SwitchButton from 'components/restaurant/SwitchButton';
import SortSwitch from 'components/restaurant/SortSwitch';

const styles = theme => ({
  restaurantListContainer: {
    marginTop: 30,
  },
  restaurantList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -10,
    marginRight: -10,
  },
  restaurantListItem: {
    boxSizing: 'border-box',
    padding: 10,
    width: `${100 / 3}%`,
  },
  divider: {
    marginTop: 2 * theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  optionDivider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  optionRow: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    paddingRight: 10,
    position: 'relative',
  },
  categoriesExpander: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    position: 'absolute',
    right: 0,
    top: 8,
  },
  categoriesExpanderIcon: {
    transition: 'transform .5s',
  },
  categoriesExpanderIconExpanded: {
    transform: 'rotate(180deg)',
  },
  filterSwitchWrapper: {
    marginBottom: -8,
    marginTop: -8,
  },
  searchBarInput: {
    paddingTop: 6,
    paddingBottom: 7,
  },
  noRestaurant: {
    textAlign: 'center',
  },
});

class RestaurantListPage extends React.Component {
  static defaultProps = {
    selectedAddress: null,
    currentLocation: null,
  };

  static numericFilterAccepted(attribute, filter) {
    if (filter.min !== null) {
      if (attribute === null) {
        return false;
      }
      if (attribute < filter.min) {
        return false;
      }
    }
    if (filter.max !== null) {
      if (attribute === null) {
        return false;
      }
      if (attribute > filter.max) {
        return false;
      }
    }
    return true;
  }

  state = {
    restaurants: null,
    categories: null,
    loading: false,
    error: null,

    categoriesExpanded: false,
    categoriesSelected: Map(),

    filterIsOpen: true,
    filterDistance: {
      min: null,
      max: null,
    },
    filterRating: {
      min: null,
      max: null,
    },
    filterDeliveryTime: {
      min: null,
      max: null,
    },
    filterDeliveryFee: {
      min: null,
      max: null,
    },
    filterOrderMinimum: {
      min: null,
      max: null,
    },

    orderBy: 'distance',
    orderByDesc: false,

    search: '',
  };

  updateSearch = lodash.debounce((search) => {
    this.setState({
      search,
    });
  }, 500);

  componentDidUpdate(prevProps, _prevState, _prevContext) {
    const { selectedAddress, currentLocation } = this.props;
    if (prevProps.selectedAddress !== selectedAddress
      || (selectedAddress === 0 && prevProps.currentLocation !== currentLocation)) {
      this.loadList();
    }
  }

  handleCategoriesExpanderClicked = () => {
    const { categoriesExpanded } = this.state;
    this.setState({
      categoriesExpanded: !categoriesExpanded,
    });
  };

  handleCategoryClicked = id => () => {
    const { categoriesSelected } = this.state;
    if (id === 0) {
      if (categoriesSelected.size > 0) {
        this.setState({
          categoriesSelected: categoriesSelected.clear(),
        });
      }
    } else if (categoriesSelected.get(id) === true) {
      this.setState({
        categoriesSelected: categoriesSelected.delete(id),
      });
    } else {
      this.setState({
        categoriesSelected: categoriesSelected.set(id, true),
      });
    }
  };

  handleIsOpenClicked = (_) => {
    const { filterIsOpen } = this.state;
    this.setState({
      filterIsOpen: !filterIsOpen,
    });
  };

  handleFilterChange = name => (type, value) => {
    const currentValue = this.state[name];
    const newState = {};
    newState[name] = {
      min: type === 'min' ? value : currentValue.min,
      max: type === 'max' ? value : currentValue.max,
    };
    this.setState(newState);
  };

  handleSortClick = name => (_) => {
    const { orderBy, orderByDesc } = this.state;
    if (orderBy === name) {
      this.setState({
        orderByDesc: !orderByDesc,
      });
    } else {
      this.setState({
        orderBy: name,
        orderByDesc: name === 'rating',
      });
    }
  };

  handleSearchChange = (e) => {
    this.updateSearch(e.target.value);
  };

  loadList() {
    const { selectedAddress, currentLocation } = this.props;
    let params = null;
    if (selectedAddress === null) {
      return;
    }
    if (selectedAddress === 0) {
      if (currentLocation === null) {
        return;
      }
      params = {
        place_id: currentLocation.place_id,
      };
    } else {
      params = {
        address_id: selectedAddress,
      };
    }
    this.setState({
      loading: true,
    });
    Api.restaurantList(params).then((res) => {
      const { restaurants, categories } = res.data;
      const categoriesSelected = Map();
      categories.forEach((category) => {
        if (this.state.categoriesSelected[category.id] === true) {
          categoriesSelected.set(category.id, true);
        }
      });
      this.setState({
        restaurants,
        categories,
        categoriesSelected,
        error: null,
        loading: false,
      });
    }).catch((err) => {
      this.setState({
        restaurants: {},
        error: err.response.message,
        loading: false,
      });
    });
  }

  filterAccepted(restaurant) {
    const {
      categoriesSelected,
      filterIsOpen,
      filterRating,
      filterDistance,
      filterDeliveryTime,
      filterDeliveryFee,
      filterOrderMinimum,
      search,
    } = this.state;
    const {
      name,
      restaurant_categories: restaurantCategories,
      is_open: isOpen,
      rating,
      distance,
      estimated_delivery_time: estimatedDeliveryTime,
      delivery_fee: deliveryFee,
      order_minimum: orderMinimum,
    } = restaurant;
    if (filterIsOpen && !isOpen) {
      return false;
    }
    if (!RestaurantListPage.numericFilterAccepted(rating, filterRating)
      || !RestaurantListPage.numericFilterAccepted(distance, filterDistance)
      || !RestaurantListPage.numericFilterAccepted(estimatedDeliveryTime, filterDeliveryTime)
      || !RestaurantListPage.numericFilterAccepted(deliveryFee, filterDeliveryFee)
      || !RestaurantListPage.numericFilterAccepted(orderMinimum, filterOrderMinimum)) {
      return false;
    }
    if (search.length > 0
      && name.toLowerCase().indexOf(search.toLowerCase()) === -1) {
      return false;
    }
    if (categoriesSelected.size > 0) {
      for (let i = 0; i < restaurantCategories.length; i += 1) {
        if (categoriesSelected.get(restaurantCategories[i].id) === true) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  render() {
    const { classes } = this.props;
    const {
      restaurants,
      categories,
      categoriesExpanded,
      categoriesSelected,
      filterIsOpen,
      filterRating,
      filterDistance,
      filterDeliveryTime,
      filterDeliveryFee,
      filterOrderMinimum,
      orderBy,
      orderByDesc,
      loading,
    } = this.state;
    const selectedAllCategories = categoriesSelected.size === 0;
    const filteredRestaurants = restaurants === null
      ? null
      : restaurants.filter(restaurant => this.filterAccepted(restaurant));
    const sortedRestaurants = filteredRestaurants === null
      ? null
      : filteredRestaurants.sort((a, b) => {
        const attrA = a[orderBy];
        const attrB = b[orderBy];
        if (attrA < attrB) {
          return orderByDesc ? 1 : -1;
        }
        if (attrA > attrB) {
          return orderByDesc ? -1 : 1;
        }
        return 0;
      });
    return (
      <div>
        <Typography variant="h4" component="h1">
          Restaurants
        </Typography>
        <Divider className={classes.divider} />
        <OptionListItem label="Address">
          <AddressSelector />
        </OptionListItem>
        <Divider className={classes.optionDivider} light />
        <OptionListItem label="Categories">
          <Collapse in={categoriesExpanded} collapsedHeight="37px">
            <div className={classes.optionRow}>
              <button
                className={classes.categoriesExpander}
                onClick={this.handleCategoriesExpanderClicked}
                type="button"
              >
                <ExpandMore
                  className={categoriesExpanded
                    ? classNames(classes.categoriesExpanderIcon,
                      classes.categoriesExpanderIconExpanded)
                    : classes.categoriesExpanderIcon}
                  fontSize="small"
                />
              </button>
              <SwitchButton
                active={selectedAllCategories}
                label="All"
                onClick={this.handleCategoryClicked(0)}
              />
              {categories !== null && categories.map(category => (
                <SwitchButton
                  active={categoriesSelected.get(category.id) === true}
                  key={category.id}
                  label={category.name}
                  onClick={this.handleCategoryClicked(category.id)}
                />
              ))}
            </div>
          </Collapse>
        </OptionListItem>
        <Divider className={classes.optionDivider} light />
        <OptionListItem label="Filters">
          <div className={classes.optionRow}>
            <SwitchButton
              active={filterIsOpen}
              onClick={this.handleIsOpenClicked}
              label="Opened"
            />
            <NumericFilter
              label="Rating"
              value={filterRating}
              onChange={this.handleFilterChange('filterRating')}
            />
            <NumericFilter
              label="Distance"
              value={filterDistance}
              onChange={this.handleFilterChange('filterDistance')}
            />
            <NumericFilter
              label="Delivery time"
              value={filterDeliveryTime}
              onChange={this.handleFilterChange('filterDeliveryTime')}
            />
            <NumericFilter
              label="Delivery fee"
              value={filterDeliveryFee}
              onChange={this.handleFilterChange('filterDeliveryFee')}
            />
            <NumericFilter
              label="Order min."
              value={filterOrderMinimum}
              onChange={this.handleFilterChange('filterOrderMinimum')}
            />
          </div>
        </OptionListItem>
        <Divider className={classes.optionDivider} light />
        <OptionListItem label="Order By">
          <div className={classes.optionRow}>
            <SortSwitch
              label="Distance"
              active={orderBy === 'distance'}
              isDesc={orderByDesc}
              onClick={this.handleSortClick('distance')}
            />
            <SortSwitch
              label="Rating"
              active={orderBy === 'rating'}
              isDesc={orderByDesc}
              defaultDesc
              onClick={this.handleSortClick('rating')}
            />
            <SortSwitch
              label="Delivery time"
              active={orderBy === 'delivery_time'}
              isDesc={orderByDesc}
              onClick={this.handleSortClick('delivery_time')}
            />
            <SortSwitch
              label="Delivery fee"
              active={orderBy === 'delivery_fee'}
              isDesc={orderByDesc}
              onClick={this.handleSortClick('delivery_fee')}
            />
            <SortSwitch
              label="Order min."
              active={orderBy === 'order_minimum'}
              isDesc={orderByDesc}
              onClick={this.handleSortClick('order_minimum')}
            />
          </div>
        </OptionListItem>
        <Divider className={classes.optionDivider} light />
        <OptionListItem label="Search">
          <TextField
            variant="outlined"
            InputProps={{
              classes: {
                input: classes.searchBarInput,
              },
            }}
            onChange={this.handleSearchChange}
            fullWidth
          />
        </OptionListItem>
        <div className={classes.restaurantListContainer}>
          {loading
            && <LineProgress />
          }
          {sortedRestaurants !== null && sortedRestaurants.length === 0
            && (
            <Typography
              className={classes.noRestaurant}
              variant="h5"
              component="div"
            >
              There is no restaurant.
            </Typography>
            )
          }
          <div className={classes.restaurantList}>
            {sortedRestaurants !== null && sortedRestaurants.map(restaurant => (
              <div className={classes.restaurantListItem} key={restaurant.id}>
                <RestaurantListItem
                  restaurant={restaurant}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  selectedAddress: state.address.selectedAddress,
  currentLocation: state.address.currentLocation,
});

RestaurantListPage.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedAddress: PropTypes.number,
  currentLocation: PropTypes.object,
};

export default withStyles(styles)(
  connect(mapStateToProps)(RestaurantListPage),
);
