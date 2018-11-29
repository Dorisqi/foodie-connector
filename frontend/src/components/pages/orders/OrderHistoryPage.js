import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
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
    float: 'left'
  },
  card: {
    width: window.screen.width*0.6,
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
  }
});

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
      currentOrder: order
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

  handleCancelOrderSuccess = () => {
    this.setState({
      cancelOrder: null,
    })
    this.loadOrderList();
  }

  handleOrderDetail = order => () => {
    this.setState({
      detailAlert: true,
      currentOrder: order,
    })
  }

  handleOrderDetailClose = () => {
    this.setState({
      detailAlert: false,
    })
  }

  loadOrderList = () => {
    Axios.cancelRequest(this.state.loadingOrders);
    this.setState({
      loadingOrders: Api.orderList().then((res) => {
        const orders = res.data;
        this.setState({
          loadingOrders: null,
          orders: orders,
        })
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
          {loadingOrders && <LinearProgress/>}
          {orders !== null
            && (
            <List>
              {orders.map(order => {
                const { image, name } = order.restaurant;
                const {
                  id,
                  is_public,
                  join_before,
                  order_status,
                  total_cost,
                  restaurant,
                  is_joinable,
                  creator,
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
                            <TableCell>Total Cost</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>{id}</TableCell>
                            <TableCell>{is_public? "Public": "Private"}</TableCell>
                            <TableCell>{creator.name}</TableCell>
                            <TableCell>{join_before}</TableCell>
                            <TableCell>{Format.formatAddress(order, true)}</TableCell>
                            <TableCell>{total_cost}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Paper>
                    <Paper>
                      <CardActionArea className={classes.image}>
                        <Link to={'/restaurants/'+restaurant.id}>
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
                            disabled={!is_joinable}
                          >
                            Share
                          </Button>
                          <Button
                            className={classes.action}
                            variant="outlined"
                            fullWidth
                            onClick={this.handleOrderDetail(order)}
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
                              disabled={order_status !== "created"}
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
                              disabled={order_status !== "created"}
                            >
                              Cancel Order
                            </Button>
                          )]
                          }
                        </ListItem>
                      </List>
                    </Paper>
                  </Card>
              )})}
            </List>
          )}
        </div>
        {currentOrder
          ? <ShareOrderDialog
              order={currentOrder}
              open={sharing}
              onClose={this.handleShareClose}
            />
          : null
        }
        {cancelOrder
          ? <DialogDeleteAlert
              key="cancel-dialog"
              open={cancelAlert}
              title="Cancel order?"
              text={`Do you really want to cancel the order ${cancelOrder.id} ?`}
              buttonLabel="Cancel"
              api={this.cancelApi}
              onUpdate={this.handleCancelOrderSuccess}
              onClose={this.handleCancelAlertClose}
            />
          : null
        }
        {currentOrder
          ? <OrderDetailDialog
              open={detailAlert}
              order={currentOrder}
              onClose={this.handleOrderDetailClose}
            />
          : null
        }
      </MainContent>
    )
  }
}


OrderHistoryPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderHistoryPage);
