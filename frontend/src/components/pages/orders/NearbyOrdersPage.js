import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Format from 'facades/Format';
import MainContent from 'components/template/MainContent';
import Api from 'facades/Api';
import Axios from 'facades/Axios';
import { Link } from 'react-router-dom';
import ShareOrderDialog from 'components/order/ShareOrderDialog';
import OrderDetailDialog from 'components/order/OrderDetailDialog';
import FormControl from '@material-ui/core/FormControl';
import AddressSelector from 'components/address/AddressSelector';
import Snackbar from 'facades/Snackbar';
import DialogDeleteAlert from 'components/alert/DialogDeleteAlert';
import classnames from 'classnames';

const styles = theme => ({
  root: {
    display: 'flex',
    marginLeft: -theme.spacing.unit,
    marginRight: -theme.spacing.unit,
  },
  section: {
    width: `${100 / 3}%`,
    padding: theme.spacing.unit,
  },
  image: {
    height: '226px',
    width: '226px',
    float: 'left',
  },
  card: {
    height: 'auto',
    margin: 'auto',
    marginBottom: 2 * theme.spacing.unit,
  },
  sectionTitle: {
    marginBottom: theme.spacing.unit,
  },
  sectionTitleWrap: {
    paddingBottom: 0,
  },
  attributeForm: {
    display: 'flex',
  },
  margin: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  itemActions: {
    paddingTop: 0,
    justifyContent: 'flex-end',
  },
  itemDelete: {
    color: theme.palette.error.main,
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
  buttonList: {
    float: 'right',
  },
});

class NearbyOrdersPage extends React.Component {
  static defaultProps = {
    selectedAddress: null,
    currentLocation: null,
  };

  constructor() {
    super();
    this.state = {
      loadingOrders: null,
      orders: null,
      currentOrder: null,
      cancelOrder: null,
      detailAlert: false,
      sharing: false,
      cancelAlert: false,
    };
  }

  componentDidMount() {
    this.loadOrderList();
  }

  componentDidUpdate(prevProps, _prevState, _prevContext) {
    const { selectedAddress, currentLocation } = this.props;
    if (prevProps.selectedAddress !== selectedAddress
      || (selectedAddress === 0 && prevProps.currentLocation !== currentLocation)) {
      this.loadOrderList();
    }
  }

  componentWillUnmount() {
    Axios.cancelRequest(this.state.loadingOrders);
  }

  handleShareClick = order => () => {
    this.setState({
      sharing: true,
      currentOrder: order,
    });
  };

  handleShareClose = () => {
    this.setState({
      sharing: false,
    });
  };

  handleCancelOrderClick = order => () => {
    this.setState({
      cancelAlert: true,
      cancelOrder: order,
    });
  };

  handleCancelAlertClose = () => {
    this.setState({
      cancelAlert: false,
    });
  };

  handleCancelOrderSuccess = id => () => {
    this.setState({
      cancelOrder: null,
    });
    Snackbar.success(`Successfully cancel order ${id}.`);
    this.loadOrderList();
  }

  handleOrderDetail = order => () => {
    this.setState({
      detailAlert: true,
      currentOrder: order,
    });
  }

  handleOrderDetailClose = () => {
    this.setState({
      detailAlert: false,
    });
  }

  handleJoinOrder = id => () => {
    Api.orderJoin(id).then(() => {
      Snackbar.success(`Successfully join order ${id}.`);
      this.loadOrderList();
    }).catch((err) => {
      throw err;
    });
  }

  loadOrderList = () => {
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
    Axios.cancelRequest(this.state.loadingOrders);
    this.setState({
      loadingOrders: Api.orderList(params).then((res) => {
        const orders = res.data;
        this.setState({
          loadingOrders: null,
          orders: orders.filter(o => o.is_joinable && o.is_visible),
        });
      }).catch((err) => {
        this.setState({
          loadingOrders: null,
        });
        throw err;
      }),
    });
  }

  cancelApi = () => {
    const { cancelOrder } = this.state;
    return Api.orderCancel(cancelOrder.id);
  };

  render() {
    const { classes } = this.props;
    const {
      orders,
      loadingOrders,
      currentOrder,
      cancelOrder,
      cancelAlert,
      detailAlert,
      sharing,
    } = this.state;
    return (
      <MainContent title="Nearby Orders">
        <FormControl className={classes.margin} fullWidth>
          <AddressSelector />
        </FormControl>
        <div className={classes.root}>
          {loadingOrders && <LinearProgress />}
          {orders !== null
            && (
            <List>
              {orders.map((order) => {
                const { image, name } = order.restaurant;
                const {
                  id,
                  is_public: isPublic,
                  join_before: joinBefore,
                  order_status: orderStatus,
                  prices: { total },
                  restaurant,
                  is_joinable: isJoinable,
                  creator,
                  distance,
                } = order;
                return (
                  <Card className={classes.card}>
                    <Paper>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Order Id</TableCell>
                            <TableCell>Visibility</TableCell>
                            <TableCell>Order Creator</TableCell>
                            <TableCell>Join Before</TableCell>
                            <TableCell>Order Address</TableCell>
                            <TableCell>Order Distance</TableCell>
                            <TableCell>Total Cost($)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>{id}</TableCell>
                            <TableCell>{isPublic ? 'Public' : 'Private'}</TableCell>
                            <TableCell>{creator.name}</TableCell>
                            <TableCell>{joinBefore}</TableCell>
                            <TableCell>{Format.formatAddress(order, true)}</TableCell>
                            <TableCell>{`${distance} m`}</TableCell>
                            <TableCell>{total}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Paper>
                    <Paper>
                      <CardActionArea className={classes.image}>
                        <Link to={`/restaurants/${restaurant.id}`}>
                          <CardMedia
                            className={classes.image}
                            image={image}
                            title={name}
                          />
                        </Link>
                      </CardActionArea>
                      <List className={classes.buttonList}>
                        <ListItem className={classes.actions}>
                          <Button
                            className={classes.action}
                            variant="outlined"
                            fullWidth
                            onClick={this.handleShareClick(order)}
                            disabled={!isJoinable}
                          >
                            Share
                          </Button>
                          <Button
                            className={classes.action}
                            variant="outlined"
                            fullWidth
                            component={Link}
                            to={`/orders/${order.id}`}
                          >
                            Order Detail
                          </Button>
                          {!order.is_creator && !order.is_member && (
                            <Button
                              key="join"
                              className={classes.action}
                              variant="outlined"
                              color="secondary"
                              fullWidth
                              onClick={this.handleJoinOrder(id)}
                            >
                              Join Order
                            </Button>
                          )
                          }
                          {order.is_creator && [(
                            <Button
                              key="checkout"
                              className={classes.action}
                              variant="outlined"
                              color="primary"
                              fullWidth
                              disabled={orderStatus !== 'created'}
                              // TODO: checkout action
                            >
                              Checkout
                            </Button>
                          ), (
                            <Button
                              key="cancel"
                              className={classnames([
                                classes.cancelButton,
                                classes.action,
                              ])}
                              variant="outlined"
                              fullWidth
                              onClick={this.handleCancelOrderClick(order)}
                              disabled={orderStatus !== 'created'}
                            >
                              Cancel Order
                            </Button>
                          )]
                          }
                        </ListItem>
                      </List>
                    </Paper>
                  </Card>
                );
              })}
            </List>
            )}
        </div>
        {currentOrder
          ? (
            <ShareOrderDialog
              order={currentOrder}
              open={sharing}
              onClose={this.handleShareClose}
            />
          )
          : null
        }
        {cancelOrder
          ? (
            <DialogDeleteAlert
              key="cancel-dialog"
              open={cancelAlert}
              title="Cancel order?"
              text={`Do you really want to cancel the order ${cancelOrder.id} ?`}
              buttonLabel="Cancel"
              api={this.cancelApi}
              onUpdate={this.handleCancelOrderSuccess(cancelOrder.id)}
              onClose={this.handleCancelAlertClose}
            />
          )
          : null
        }
        {currentOrder
          ? (
            <OrderDetailDialog
              open={detailAlert}
              order={currentOrder}
              onClose={this.handleOrderDetailClose}
            />
          )
          : null
        }
      </MainContent>
    );
  }
}

const mapStateToProps = state => ({
  selectedAddress: state.address.selectedAddress,
  currentLocation: state.address.currentLocation,
});

NearbyOrdersPage.propTypes = {
  classes: PropTypes.object.isRequired,
  selectedAddress: PropTypes.number,
  currentLocation: PropTypes.object,
};

export default withStyles(styles)(
  connect(mapStateToProps)(NearbyOrdersPage),
);
