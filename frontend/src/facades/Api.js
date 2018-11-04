import axios from 'axios';
import Auth from './Auth';

class Api {
  static login(data) {
    return this.instance(false).post('/auth/login', data);
  }

  static register(data) {
    return this.instance(false).post('/auth/register', data);
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
}

export default Api;
