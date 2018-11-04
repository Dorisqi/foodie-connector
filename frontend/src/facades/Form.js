import update from 'immutability-helper';

class Form {
  static handleInputChange = (component, name) => event => {
    let state = {
      errors: update(component.state.errors, { $unset: [name] }),
    };
    state[name] = event.target.value;
    component.setState(state);
  };

  static handleErrors = component => err => {
    let response = err.response;
    let errors = {};
    switch (response.status) {
      case 401:
        let errorMessage = [response.data.message];
        if (response.headers['x-ratelimit-remaining'] !== undefined) {
          if (response.headers['x-ratelimit-remaining'] > 0) {
            errorMessage.push(`Your account will be blocked for 10 minutes if you failed to login for ${response.headers['x-ratelimit-remaining']} more times.`);
          } else {
            errorMessage.push(`Your account has been blocked. Please try again in ${response.headers['retry-after']} seconds.`);
          }
        }
        errors.form = errorMessage;
        break;
      case 422:
        let errorData = response.data.data;
        for (let field in errorData) {
          if (errorData.hasOwnProperty(field)) {
            errors[field] = errorData[field][0];
          }
        }
        break;
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
  }
}

export default Form;
