import queryString from 'query-string';
import lodash from 'lodash';
import store from 'store';
import { clearAddress } from 'actions/addressActions';
import LocalStorage from './LocalStorage';
import Pusher from './Pusher';

class Auth {
  static authenticateUser(authentication) {
    store.dispatch(clearAddress());
    LocalStorage.setItem('authentication', authentication);
    Pusher.init(); // TODO
  }

  static authenticateFromResponse = component => (res) => {
    const { api_token: apiToken, user: { id } } = res.data;
    Auth.authenticateUser(apiToken);
    LocalStorage.setItem('userId', id);
    const { history, location } = component.props;
    Auth.redirect(history, location);
  };

  static isUserAuthenticated() {
    return LocalStorage.getItem('authentication') !== null;
  }

  static deauthenticateUser() {
    store.dispatch(clearAddress());
    LocalStorage.removeItem('authentication');
    LocalStorage.removeItem('userId');
    Pusher.init();
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
