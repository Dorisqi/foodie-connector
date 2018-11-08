import queryString from 'query-string';
import lodash from 'lodash';
import store from 'store';
import { clearAddress } from 'actions/addressActions';
import LocalStorage from './LocalStorage';

class Auth {
  static authenticateUser(authentication, email) {
    store.dispatch(clearAddress());
    LocalStorage.setItem('authentication', authentication);
    LocalStorage.setItem('email', email);
  }

  static authenticateFromResponse = component => (res) => {
    const { api_token: apiToken, user } = res.data;
    Auth.authenticateUser(apiToken, user.email);
    const { history, location } = component.props;
    Auth.redirect(history, location);
  };

  static isUserAuthenticated() {
    return LocalStorage.getItem('authentication') !== null;
  }

  static deauthenticateUser() {
    store.dispatch(clearAddress());
    LocalStorage.removeItem('authentication');
    LocalStorage.removeItem('email');
  }

  static getToken() {
    return LocalStorage.getItem('authentication');
  }

  static getEmail() {
    return LocalStorage.getItem('email');
  }

  static setEmail(email) {
    LocalStorage.setItem('email', email);
  }

  static redirect(history, location) {
    const queries = queryString.parse(location.search);
    if (lodash.isNil(queries.from)) {
      history.push('/');
    } else {
      history.replace(queries.from);
    }
  }
}

export default Auth;
