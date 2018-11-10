import Auth from './Auth';
import axios from './Axios';

class Api {
  /* --- Auth --- */
  static login(email, password) {
    return this.instance(false).post('/auth/login', { email, password });
  }

  static register(name, email, password) {
    return this.instance(false).post('/auth/register', { name, email, password });
  }

  static resetPasswordEmail(email) {
    return this.instance(false).post('/auth/reset-password-email', { email });
  }

  static resetPassword(email, token, password) {
    return this.instance(false).post('/auth/reset-password', { email, token, password });
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

  /* --- Cart --- */
  static cartShow() {
    return this.instance().get('/cart');
  }

  static cartUpdate(restaurantId, cart) {
    return this.instance().put('/cart', {
      restaurant_id: restaurantId,
      cart,
    });
  }

  static restaurantShow(id, withMenu = true) {
    return this.instance().get(`/restaurants/${id}`, {
      params: {
        with_menu: withMenu,
      },
    });
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
