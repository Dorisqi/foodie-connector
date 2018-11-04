class Auth {
  static authenticateUser(authentication, email) {
    localStorage.setItem('authentication', authentication);
    localStorage.setItem('email', email);
  }

  static isUserAuthenticated() {
    return localStorage.getItem('authentication') !== null;
  }

  static deauthenticateUser() {
    localStorage.removeItem('authentication');
    localStorage.removeItem('email');
  }

  static getToken() {
    return localStorage.getItem('authentication');
  }

  static getEmail() {
    return localStorage.getItem('email');
  }

  static setEmail(email) {
    localStorage.setItem('email', email);
  }
}

export default Auth;
