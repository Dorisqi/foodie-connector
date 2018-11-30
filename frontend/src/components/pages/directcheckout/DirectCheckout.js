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

class DirectCheckout extends React.Component {
  state = {
    selectedCardId: null,
    tip: null,
    total: null,
    creatorName: null,
    userAddressLine1: null,
    userAddressLine2: null,
    userCity:null,
    userPhone: null,

    restaurantName: null,
    resAddressLine1: null,
    resAddressLine2: null,
    resCity: null,
    resPhone: null,

  }
  componentDidMount() {
    this.handleInfo();
  }
  handlePayment = () => {
    const { history } = this.props;
    history.push({
      pathname: `/orders/${this.props.location.state.orderId}/pay`,
      state: {
        card_id: this.state.selectedCardId,
        orderId: this.props.location.state.orderId,
      },
    });
  };

  handleCardId = (e) => {
    this.setState({
      selectedCardId: e,

    });
    if (this.state.tip !== null) {
      Api.orderPay(this.props.location.state.orderId,this.state.tip, e).then((res) => {
        this.setState({
          total: res.data.total,

        });
      }).catch((err) => {
        throw err;
      });
    }
  };

  handleSetTip = (event) => {
    this.setState({
      tip: event.target.value,
    });
    if (this.state.selectedCardId !== null) {
      Api.orderPay(this.props.location.state.orderId, event.target.value, this.state.selectedCardId).then((res) => {
        this.setState({
          total: res.data.total,
        });
      }).catch((err) => {
        throw err;
      });
    }
  };

  handleInfo = () => {
    Api.orderDetail(this.props.location.state.orderId).then((res) => {
      this.setState({
        creatorName: res.data.creator.name,
        userAddressLine1: res.data.address_line_1,
        userAddressLine2: res.data.address_line_2,
        userCity: res.data.city,
        userPhone: res.data.phone,

        restaurantName: res.data.restaurant.name,
        resAddressLine1: res.data.restaurant.address_line_1,
        resAddressLine2:res.data.restaurant.address_line_2,
        resCity:res.data.restaurant.city,
        resPhone:res.data.restaurant.phone,
      });
    }).catch((err) => {
      throw err;
    });
  };

  render() {
    const {tip,
          selectedCardId,
          total,
          creatorName,
          userAddressLine1,
          userAddressLine2,
          userCity,
          userPhone,

          restaurantName,
          resAddressLine1,
          resAddressLine2,
          resCity,
          resPhone,
        } = this.state;
    const { classes, location } = this.props;

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
                restaurant={this.props.location.state.restaurant}
                cart={this.props.location.state.restaurant}
                productMap={this.props.location.state.productMap}
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
                        {creatorName}
                        <br />
                        {userAddressLine2}
                        <br />
                        {userAddressLine1}
                        <br />
                        {userCity}
                        <br />
                        {userPhone}
                      </span>
                    )}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Contact Restaurant"
                    secondary={(
                      <span>
                        {restaurantName}
                        <br />
                        {resAddressLine2}
                        <br />
                        {resAddressLine1}
                        <br />
                        {resCity}
                        <br />
                        {resPhone}
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
                      primary={`Subtotal: ${Format.displayPrice(this.props.location.state.sutotal)}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      className={classes.summaryPrice}
                      primary={`Delivery Fee: ${Format.displayPrice(this.props.location.state.delivery_fee)}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      className={classes.summaryPrice}
                      primary={`Tax: ${Format.displayPrice(this.props.location.state.tax)}`}
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

DirectCheckout.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
export default compose(
  withStyles(styles),
  connect(mapStateToProps),
)(withRouter(DirectCheckout));
