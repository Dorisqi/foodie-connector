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

const styles = theme => ({
  actions: {
    display: 'block',
  },
});
class PaymentPage extends React.Component {
  state = {
    tip: 0,
    card_id: 0,
  }
  render(){
    const {classes} = this.props;
    const {tip, card_id} = this.state;
    console.log(this.props.location.state.orderId);
    console.log(this.props.location.state.card_id);
    return(
        <MainContent title="Thank you, your order has been placed">
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
