import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import AddressSelector from 'components/address/AddressSelector';
import DialogForm from 'components/form/DialogForm';
import InputTextField from 'components/form/InputTextField';
import Axios from 'facades/Axios';
import Form from 'facades/Form';
import Api from 'facades/Api';
import Snackbar from 'facades/Snackbar';
import Format from 'facades/Format';
import GroupmemberStatusTable from 'components/order/GroupmemberStatusTable';
import AddressDialog from 'components/address/AddressDialog';
import OrderActions from 'components/order/OrderActions';
import { withRouter } from 'react-router-dom';
import compose from 'recompose/compose';

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
});


class RestaurantOrder extends React.Component {
  state = {
    visibility: 'private',
    joinLimit: 10,
    loading: null,
    loadingDeliverable: null,
    creatingOrder: false,
    addingAddress: false,
    errors: {},
    order: null,
  };

  componentDidMount() {
    this.loadOrder();
  }

  componentDidUpdate(prevProps, _prevState, _snapshot) {
    if (prevProps.restaurant.id !== this.props.restaurant.id) {
      this.loadOrder();
    }
    if (prevProps.address.selectedAddress !== this.props.address.selectedAddress
      || (this.props.address.selectedAddress === 0
        && prevProps.address.currentLocation !== this.props.address.currentLocation)) {
      this.loadDeliverable();
    }
  }

  componentWillUnmount() {
    Axios.cancelRequest(this.state.loading);
    Axios.cancelRequest(this.state.loadingDeliverable);
  }

  createApi = () => {
    const { address, restaurant } = this.props;
    const { visibility, joinLimit } = this.state;
    this.setState({
      errors: {},
    });
    return Api.orderCreate(
      restaurant.id,
      address.selectedAddress,
      visibility === 'public',
      joinLimit * 60,
    );
  };

  loadOrder = () => {
    const { restaurant } = this.props;
    Axios.cancelRequest(this.state.loading);
    this.setState({
      loading: Api.orderList({ restaurant_id: restaurant.id, order_status: 'created' }).then((res) => {
        this.setState({
          loading: null,
          order: res.data.length > 0 ? res.data[0] : null,
        });
        if (restaurant.is_deliverable === null) {
          this.loadDeliverable();
        }
      }).catch((err) => {
        this.setState({
          loading: null,
        });
        throw (err);
      }),
    });
  };

  loadDeliverable = () => {
    const { address, restaurant } = this.props;
    if (address.selectedAddress === null
      || (address.selectedAddress === 0 && address.currentLocation === null)) {
      this.props.onRestaurantUpdate({
        is_deliverable: null,
      });
      return;
    }
    Axios.cancelRequest(this.state.loadingDeliverable);
    const promise = address.selectedAddress === 0
      ? Api.restaurantShow(restaurant.id, false, null, address.currentLocation.place_id)
      : Api.restaurantShow(restaurant.id, false, address.selectedAddress);
    this.setState({
      loadingDeliverable: promise.then((res) => {
        this.props.onRestaurantUpdate(res.data);
        this.setState({
          loadingDeliverable: null,
        });
      }),
    });
  };

  handleCreateOrderSuccess = (res) => {
    Snackbar.success('Successfully create group order');
    this.setState({
      order: res.data,
    });
  };

  handleCreateOrderClose = () => {
    this.setState({
      creatingOrder: false,
    });
  };

  handleAddingAddressClose = () => {
    const { address } = this.props;
    this.setState({
      addingAddress: false,
      creatingOrder: address.selectedAddress !== 0,
    });
  };

  handleCreateOrderClick = () => {
    if (this.props.address.selectedAddress === 0) {
      this.setState({
        addingAddress: true,
      });
    } else {
      this.setState({
        creatingOrder: true,
      });
    }
  };

  handleConfirmSuccess = () => {
    const { order } = this.state;
    this.props.history.push(`/orders/${order.id}`);
  };

  render() {
    const { classes, restaurant, address } = this.props;
    const {
      order,
      visibility,
      loading,
      creatingOrder,
      errors,
      loadingDeliverable,
      addingAddress,
    } = this.state;
    if (loading !== null) {
      return (
        <LinearProgress />
      );
    }
    const needLoadingDeliverable = loadingDeliverable || restaurant.is_deliverable === null;
    return (
      <Card>
        {order === null
        && (
        <CardContent>
          <FormControl className={classes.margin} fullWidth>
            <AddressSelector />
          </FormControl>
          {needLoadingDeliverable
          && <LinearProgress />
          }
          {!needLoadingDeliverable && (restaurant.is_deliverable
            ? (
              <FormControl className={classes.margin} fullWidth>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleCreateOrderClick}
                >
                  Create Group Order
                </Button>
              </FormControl>
            ) : (
              <Typography className={classes.errorText} variant="body1" component="div">
                This address is not deliverable.
              </Typography>
            ))}
          {creatingOrder
          && (
          <DialogForm
            title="Create Group Order"
            submitLabel="Create"
            formErrors={errors.form}
            api={this.createApi}
            onRequestSucceed={this.handleCreateOrderSuccess}
            onRequestFailed={Form.handleErrors(this)}
            onClose={this.handleCreateOrderClose}
          >
            <FormControl className={classes.margin} fullWidth>
              <FormLabel>
                Visibility
              </FormLabel>
              <RadioGroup
                className={classes.visibilityGroup}
                aria-label="visibility"
                name="visibility"
                value={visibility}
                onChange={Form.handleInputChange(this, 'visibility')}
              >
                <FormControlLabel
                  className={classes.visibilityRadio}
                  value="public"
                  control={<Radio />}
                  label="Public"
                />
                <FormControlLabel
                  className={classes.visibilityRadio}
                  value="private"
                  control={<Radio />}
                  label="Private"
                />
              </RadioGroup>
            </FormControl>
            <InputTextField
              parent={this}
              name="joinLimit"
              label="Can be joined in"
              endAdornment={<InputAdornment position="end">mins</InputAdornment>}
            />
          </DialogForm>
          )
          }
          {addingAddress && (
            <AddressDialog
              onClose={this.handleAddingAddressClose}
              currentLocation={address.currentLocation}
            />
          )}
        </CardContent>
        )
        }
        {order !== undefined && order !== null
        && (
        <List>
          <ListItem>
            <ListItemText
              primary="Order ID"
              secondary={order.id}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Visibility"
              secondary={order.is_public ? 'Public' : 'Private'}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Join before"
              secondary={order.join_before}
              secondaryTypographyProps={{
                className: order.is_joinable ? null : classes.errorText,
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Order address"
              secondary={Format.formatAddress(order, true)}
            />
          </ListItem>
          <OrderActions
            order={order}
            showOrderDetailButton
            onCancelSuccess={this.loadOrder}
            onConfirmSuccess={this.handleConfirmSuccess}
          />
          <div className={classes.subComponent}>
            <Typography
              className={classes.subComponentTitle}
              variant="h5"
              component="h2"
            >
              Group Member
            </Typography>
            <GroupmemberStatusTable order={order} />
          </div>
        </List>
        )
        }
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  address: state.address,
});


RestaurantOrder.propTypes = {
  classes: PropTypes.object.isRequired,
  address: PropTypes.object.isRequired,
  restaurant: PropTypes.object.isRequired,
  onRestaurantUpdate: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps),
)(withRouter(RestaurantOrder));
