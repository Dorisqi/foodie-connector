import axios from 'axios';
import ApiMock from '__mocks__/api/ApiMock';
import Auth from './Auth';

class Api {
  static isMocking = false;

  /* --- Auth --- */
  static login(data) {
    return this.handleRequest(this.instance(false).post('/auth/login', data));
  }

  static register(data) {
    return this.handleRequest(this.instance(false).post('/auth/register', data));
  }

  static resetPasswordEmail(data) {
    return this.handleRequest(this.instance(false).post('/auth/reset-password-email', data));
  }

  static resetPassword(data) {
    return this.handleRequest(this.instance(false).post('/auth/reset-password', data));
  }

  /* --- Address --- */
  static addressList() {
    return this.handleRequest(this.instance().get('/addresses'));
  }

  /* --- Restaurant --- */
  static restaurantList(data) {
    return this.handleRequest(this.instance().get('/restaurants', {
      params: data,
    }));
  }

  static handleRequest(promise) {
    if (this.isMocking) {
      return ApiMock.handleRequest(promise);
    }
    return promise;
  }

  static instance(requireAuth = true) {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
    });

    if (requireAuth) {
      instance.defaults.headers.common.Authorization = Auth.getToken();
    }
    return instance;
  }

  static mocking() {
    this.isMocking = true;
    ApiMock.setup(axios);
  }
}

export default Api;
