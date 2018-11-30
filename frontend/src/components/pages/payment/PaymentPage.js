import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import MainContent from 'components/template/MainContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Api from 'facades/Api';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
const styles = () => ({
  subComponentTitle: {
    display: 'block',
  },
  actions: {
    display: 'block',
  },
});
class PaymentPage extends React.Component {
  state = {
    orderMembers: [],
    memberStatus: true,
    isReady: false,
    orderStatus: null,
    time: null,
  }

  componentDidMount() {
    this.handleMemberStatus();
  }

  handleMemberStatus = () => {
    const {orderMembers, isReady, memberStatus} = this.state;
    Api.orderDetail(this.props.location.state.orderId).then((res) =>{
      this.setState({
        orderMembers: res.data.order_members,
      });
    }).catch((err) => {
      throw err;
    });
    for (var i = 0; i < orderMembers.length; i++) {
      if (orderMembers[i].is_ready !== true)
      {
        this.setState({
          memberStatus: false,
        });
      }
    }
    if (memberStatus === true)
    {
      this.setState({
        isReady: memberStatus,
      });
    }
  };

  handleOrderConfirm = () => {
    Api.orderConfirm(this.props.location.state.orderId).then((res) =>{
      console.log(res.data);
      this.setState({
        orderStatus: res.data.order_statuses[0].status,
        time: res.data.order_statuses[0].time,
      });
    }).catch((err) => {
      throw err;
    });
  };
  render() {
    const {isReady, orderStatus, time, orderMembers} = this.state;
    const { classes } = this.props;
    console.log(orderMembers);
    return (
      <MainContent title="Payment Successful">
      {orderMembers.length > 1
        ? (
          <div>
          <Button
            className={classes.action}
            variant="outlined"
            color="primary"
            disable={isReady === false}
            onClick={this.handleOrderConfirm}
          >
            Confirm Order
          </Button>
          {orderStatus !== null && time !== null
              && (
                <Paper>
                  <List>
                    <ListItem>
                      <ListItemText
                        className={classes.subComponentTitle}
                        primary={`Order status: ${orderStatus}`}
                        primaryTypographyProps={{
                          variant: 'subtitle1',
                        }}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        className={classes.subComponentTitle}
                        primary={`Time Confrimed: ${time}`}
                        primaryTypographyProps={{
                          variant: 'subtitle1',
                        }}
                      />
                    </ListItem>
                </List>
              </Paper>
              )
            }
          </div>
        )
         : [
          <Typography
            className={classes.subComponentTitle}
            variant="subtitle1"
            component="h2"
          >
                  Please check your notification box to track the order status...
          </Typography>
        ]
      }
      </MainContent>
    );
  }
}

PaymentPage.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
)(withRouter(PaymentPage));
