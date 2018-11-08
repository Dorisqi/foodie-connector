import Auth from './Auth';

class Api {
  static axios = null;

  /* --- Auth --- */
  static login(data) {
    return this.instance(false).post('/auth/login', data);
  }

  static register(data) {
    return this.instance(false).post('/auth/register', data);
  }

  static resetPasswordEmail(data) {
    return this.instance(false).post('/auth/reset-password-email', data);
  }

  static resetPassword(data) {
    return this.instance(false).post('/auth/reset-password', data);
  }

  /* --- Address --- */
  static addressList() {
    return this.instance().get('/addresses');
  }

  /* --- Restaurant --- */
  static restaurantList(data) {
    return this.instance().get('/restaurants', {
      params: data,
    });
  }

  static initialize(axios) {
    if (this.axios !== null) {
      return;
    }
    Api.axios = axios;
  }

  static instance(requireAuth = true) {
    const instance = Api.axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
    });

    if (requireAuth) {
      instance.defaults.headers.common.Authorization = Auth.getToken();
    }
    return instance;
  }
}

export default Api;
