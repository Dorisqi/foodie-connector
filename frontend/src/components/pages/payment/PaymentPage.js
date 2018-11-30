import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import compose from 'recompose/compose'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Api from 'facades/Api';
import MainContent from 'components/template/MainContent';
import CardSelector from 'components/card/CardSelector';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  actions: {
    display: 'block',
  },
});
class PaymentPage extends React.Component {
  state = {
    card_id: 0,
    orderstatus: null,
    ordertime: null,
  }
  componentDidMount() {
    this.loadingOrderStatus();
  };
  loadingOrderStatus =() => {
    Api.orderDetail(this.props.location.state.orderId).then((res) =>{
        this.setState({
          orderstatus: res.data.order_statuses[0].status,
          ordertime: res.data.order_statuses[0].time,
        });
    }).catch((err) =>{
      throw err;
    })
  };
  render(){
    const {classes} = this.props;
    const {orderstatus, ordertime, card_id} = this.state;
    console.log(this.props.location.state.orderId);
    console.log(this.props.location.state.card_id);
    return(
        <MainContent title="Thank you, your order has been placed">
              <Typography
                className={classes.subComponentTitle}
                variant="h6"
                component="h2"
              >
                Please check your notification box to track the order status
              </Typography>
        </MainContent>
    );
  }
}
const mapStateToProps = state => ({

});
PaymentPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(withRouter(PaymentPage))
