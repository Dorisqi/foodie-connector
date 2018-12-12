import React from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import DialogDeleteAlert from 'components/alert/DialogDeleteAlert';
import OrderDetailDialog from 'components/order/OrderDetailDialog';
import Snackbar from 'facades/Snackbar';
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

const RED = '#FF0000';
const GREEN = '#33FE0B';
const WHITE = '#FFFFFF';

class OrderHistoryPage extends React.Component {
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

  handleGroupCheckout = order => () => {
    this.props.history.push({
      pathname: `/orders/${order.id}/checkout`,
      state: { order },
    });
  }

  handleRate = (id, isPostive) => () => {
    Api.orderRate(id, isPostive).then(() => {
      this.setState((state) => {
        const { orders } = state;
        const order = orders.find(o => o.id === id);
        order.current_order_member.rate_is_positive = isPostive;
        return ({
          orders,
        });
      });
    }).catch((err) => {
      throw err;
    });
  }

  loadOrderList = () => {
    Axios.cancelRequest(this.state.loadingOrders);
    this.setState({
      loadingOrders: Api.orderList().then((res) => {
        const orders = res.data;
        this.setState({
          loadingOrders: null,
          orders,
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
      <MainContent title="Order History">
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
                  current_order_member: { rate_is_positive: rate, is_ready: isReady },
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
                          {order.is_creator && [(
                            <Button
                              key="checkout"
                              className={classes.action}
                              variant="outlined"
                              color="primary"
                              fullWidth
                              disabled={isReady}
                              onClick={this.handleGroupCheckout(order)}
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
                              disabled={!isJoinable}
                            >
                              Cancel Order
                            </Button>
                          )]
                          }
                          {orderStatus === 'delivered'
                            ? (
                              <ListItem className={classes.action}>
                                <Button
                                  styles={{ marginRight: '100%' }}
                                  variant="contained"
                                  onClick={this.handleRate(id, true)}
                                >
                                  <i
                                    className="material-icons"
                                    style={{ color: rate === true ? RED : WHITE }}
                                  >
                                    thumb_up
                                  </i>
                                </Button>
                                <Button
                                  styles={{ marginLeft: '100%' }}
                                  variant="contained"
                                  onClick={this.handleRate(id, false)}
                                >
                                  <i
                                    className="material-icons"
                                    style={{ color: rate === false ? GREEN : WHITE }}
                                  >
                                    thumb_down
                                  </i>
                                </Button>
                              </ListItem>
                            )
                            : null
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


OrderHistoryPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderHistoryPage);
