import Auth from './Auth';
import axios from './Axios';

class Api {
  /* --- Auth --- */
  static login(email, password) {
    return Api.instance(false).post('/auth/login', { email, password });
  }

  static register(name, email, password) {
    return Api.instance(false).post('/auth/register', { name, email, password });
  }

  static resetPasswordEmail(email) {
    return Api.instance(false).post('/auth/reset-password-email', { email });
  }

  static resetPassword(email, token, password) {
    return Api.instance(false).post('/auth/reset-password', { email, token, password });
  }

  /* --- Profile --- */
  static profileShow() {
    return Api.instance().get('/profile');
  }

  static profileUpdate(name) {
    return Api.instance().put('/profile', { name });
  }

  static profileEmailUpdate(email) {
    return Api.instance().put('/profile/email', { email });
  }

  static profilePasswordUpdate(oldPassword, newPassword) {
    return Api.instance().put('/profile/password', {
      old_password: oldPassword,
      new_password: newPassword,
    });
  }

  /* --- Address --- */
  static addressList() {
    return Api.instance().get('/addresses');
  }

  /* --- Restaurant --- */
  static restaurantList(data) {
    return Api.instance().get('/restaurants', {
      params: data,
    });
  }

  /* --- Cart --- */
  static cartShow() {
    return Api.instance().get('/cart');
  }

  static cartUpdate(restaurantId, cart) {
    return Api.instance().put('/cart', {
      restaurant_id: restaurantId,
      cart,
    });
  }

  static restaurantShow(id, withMenu = true) {
    return Api.instance().get(`/restaurants/${id}`, {
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
