import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Button';
import {
  CardElement,
  injectStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  PostalCodeElement
} from 'react-stripe-elements';

// const handleBlur = () => {
//   console.log('[blur]');
// };
// const handleChange = (change) => {
//   console.log('[change]', change);
// };
// const handleClick = () => {
//   console.log('[click]');
// };
// const handleFocus = () => {
//   console.log('[focus]');
// };
// const handleReady = () => {
//   console.log('[ready]');
// };

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};


class _SplitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      name: '',
      is_default: false,
    }
    this.handleSetDefault = this.handleSetDefault.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameOnChange = this.handleNameOnChange.bind(this);
  }
  handleNameOnChange(event) {
    const { value } = event.target;
    this.setState({ name: value});
  }

  handleSetDefault(event) {
    const { checked } = event.target;
    this.setState({
      is_default: checked,
    }, () => console.log(this.state));
  }
  handleSubmit(event) {
    event.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
        .then((payload) => {
          const { name, is_default } = this.state;
          console.log('token', payload.token);
          this.postPaymentInfo(payload.token.id, name, is_default);
      });
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };
  postPaymentInfo(token, name, is_default) {
    const { postPaymentInfo } = this.props;
    const body = {
      token: token,
      nickname: name,
      is_default: is_default,
    }
    console.log('body', body);
    postPaymentInfo(body);
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Card number
          <CardNumberElement
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label>
          Expiration date
          <CardExpiryElement
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label>
          CVC
          <CardCVCElement
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label>
          Name
          <input name="name" type="text" placeholder="Jane Doe"
                 onChange={this.handleNameOnChange} required />
        </label>
        <br/>
        <Checkbox
          checked={this.state.is_default}
          onChange={this.handleSetDefault}
          color="primary"
        />
        <label>
          set to default
        </label>
        <br/>
        <Input type="submit" value="Submit">Add Credit Card</Input>
      </form>
    );
  }
}

_SplitForm.propTypes = {
  postPaymentInfo: PropTypes.func.isRequired,
};

const SplitForm = injectStripe(_SplitForm);
export default SplitForm;
