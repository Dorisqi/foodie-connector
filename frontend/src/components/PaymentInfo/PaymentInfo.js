import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardForm from './CardForm';
import axios from 'axios';
import Auth from '../../Auth/Auth';
import request from '../../request';


const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },

});



class PaymentInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      token: '',
    }
    this.postPaymentInfo = this.postPaymentInfo.bind(this);
  }

  componentDidMount() {

  }


  postPaymentInfo(body) {
    request.post('/api/v1/cards', body)
    .then((res) => console.log('res', res))
    .catch((err) => console.log('err', err));

  }

  render() {
  

    return (
      <CardForm></CardForm>

    );
  }
}

PaymentInfo.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(PaymentInfo);
