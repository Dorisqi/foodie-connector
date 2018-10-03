import React from 'react';
import PropTypes from 'prop-types';
import SplitForm from './SplitForm';
import { Elements, StripeProvider } from 'react-stripe-elements';
import apiKeys from '../../apiKeys';

class CardForm extends React.Component {
  constructor() {
    super();
    this.state = {
      elementFontSize: window.innerWidth < 450 ? '14px' : '18px',
    };
    this.postPaymentInfo = this.postPaymentInfo.bind(this);

    window.addEventListener('resize', () => {
      if (window.innerWidth < 450 && this.state.elementFontSize !== '14px') {
        this.setState({elementFontSize: '14px'});
      } else if (
        window.innerWidth >= 450 &&
        this.state.elementFontSize !== '18px'
      ) {
        this.setState({elementFontSize: '18px'});
      }
    });
  }

  postPaymentInfo(body) {
    const { postPaymentInfo } = this.props;
    postPaymentInfo(body);
  }

  render() {
    return (
      <StripeProvider apiKey={apiKeys.stripeAPIKey}>
        <Elements>
          <SplitForm postPaymentInfo={this.postPaymentInfo} fontSize={this.state.elementFontSize} />
        </Elements>
      </StripeProvider>
    );
  }
}

CardForm.propTypes = {
  postPaymentInfo: PropTypes.func.isRequired,
};

export default CardForm;
