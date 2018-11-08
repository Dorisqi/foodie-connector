import update from 'immutability-helper';

class Form {
  static handleInputChange = (component, name) => (event) => {
    const state = {
      errors: update(component.state.errors, { $unset: [name] }),
    };
    state[name] = event.target.value;
    component.setState(state);
  };

  static handleErrors = component => (err) => {
    const response = err.response;
    const errors = {};
    switch (response.status) {
      case 401: {
        const errorMessage = [response.data.message];
        if (response.headers['x-ratelimit-remaining'] !== undefined) {
          if (response.headers['x-ratelimit-remaining'] > 0) {
            errorMessage.push(`Your account will be blocked for 10 minutes if you failed for ${response.headers['x-ratelimit-remaining']} more times.`);
          } else {
            errorMessage.push(`Your account has been blocked. Please try again in ${response.headers['retry-after']} seconds.`);
          }
        }
        errors.form = errorMessage;
        break;
      }
      case 422: {
        const errorData = response.data.data;
        Object.entries(errorData).forEach((entry) => {
          errors[entry[0]] = entry[1][0];
        });
        break;
      }
      case 429:
        errors.form = [
          response.data.message,
          `Please try again in ${response.headers['retry-after']} seconds.`,
        ];
        break;
      default:
        errors.form = [
          'Unknown error',
          JSON.stringify(response.data),
        ];
    }
    component.setState({ errors });
  };

  static confirmPassword(component) {
    if (component.state.password !== component.state.confirmPassword) {
      component.setState({
        errors: {
          confirmPassword: 'The passwords do not match.',
        },
      });
      return false;
    }
    return true;
  }
}

export default Form;
