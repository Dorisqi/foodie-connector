import store from 'store';
import { clearAddress } from 'actions/addressActions';
import LocalStorage from './LocalStorage';

class Auth {
  static authenticateUser(authentication, email) {
    store.dispatch(clearAddress());
    LocalStorage.setItem('authentication', authentication);
    LocalStorage.setItem('email', email);
  }

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

  static redirect(history, from) {
    if (from === null) {
      history.push('/');
    } else {
      history.replace(from);
    }
  }
}

export default Auth;
