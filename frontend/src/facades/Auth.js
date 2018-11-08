import queryString from 'query-string';
import lodash from 'lodash';
import store from 'store';
import { clearAddress } from 'actions/addressActions';
import LocalStorage from './LocalStorage';

class Auth {
  static authenticateUser(authentication) {
    store.dispatch(clearAddress());
    LocalStorage.setItem('authentication', authentication);
  }

  static authenticateFromResponse = component => (res) => {
    const { api_token: apiToken } = res.data;
    Auth.authenticateUser(apiToken);
    const { history, location } = component.props;
    Auth.redirect(history, location);
  };

  static isUserAuthenticated() {
    return LocalStorage.getItem('authentication') !== null;
  }

  static deauthenticateUser() {
    store.dispatch(clearAddress());
    LocalStorage.removeItem('authentication');
  }

  static getToken() {
    return LocalStorage.getItem('authentication');
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
