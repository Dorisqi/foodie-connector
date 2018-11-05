import LocalStorage from './LocalStorage';

class Auth {
  static authenticateUser(authentication, email) {
    LocalStorage.setItem('authentication', authentication);
    LocalStorage.setItem('email', email);
  }

  static isUserAuthenticated() {
    return LocalStorage.getItem('authentication') !== null;
  }

  static deauthenticateUser() {
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
}

export default Auth;
