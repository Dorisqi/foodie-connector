import Auth from './Auth';
import axios from './Axios';
import mockNotifications from '../mockData/mockNotifications';

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
  static geoCodingByCoords(lat, lng) {
    return Api.instance().get('/geo-coding/coords', {
      params: {
        lat,
        lng,
      },
    });
  }

  static addressList() {
    return Api.instance().get('/addresses');
  }

  static addressAdd(placeId, line2, name, phone, isDefault) {
    return Api.instance().post('/addresses', {
      place_id: placeId,
      line_2: line2,
      name,
      phone,
      is_default: isDefault,
    });
  }

  static addressUpdate(id, placeId, line2, name, phone, isDefault) {
    return Api.instance().put(`/addresses/${id}`, {
      place_id: placeId,
      line_2: line2,
      name,
      phone,
      is_default: isDefault,
    });
  }

  static addressSetDefault(id) {
    return Api.instance().put(`/addresses/${id}`, { is_default: true });
  }

  static addressDelete(id) {
    return Api.instance().delete(`/addresses/${id}`);
  }

  /* --- Card --- */
  static cardList() {
    return Api.instance().get('/cards');
  }

  static cardAdd(nickname, token, isDefault) {
    return Api.instance().post('/cards', {
      nickname,
      token,
      is_default: isDefault,
    });
  }

  static cardUpdate(id, nickname, expirationMonth, expirationYear, zipCode, isDefault) {
    return Api.instance().put(`/cards/${id}`, {
      nickname,
      expiration_month: expirationMonth,
      expiration_year: expirationYear,
      zip_code: zipCode,
      is_default: isDefault,
    });
  }

  static cardSetDefault(id) {
    return Api.instance().put(`/cards/${id}`, { is_default: true });
  }

  static cardDelete(id) {
    return Api.instance().delete(`/cards/${id}`);
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

  static restaurantShow(id, withMenu = true, addressId = null, placeId = null) {
    return Api.instance().get(`/restaurants/${id}`, {
      params: {
        with_menu: withMenu,
        address_id: addressId,
        place_id: placeId,
      },
    });
  }

  /* --- Order --- */
  static orderShow(restaurantId) {
    return Api.instance().get('/orders/',restaurantId);
  }

  static orderList(restaurantId, orderStatus) {
    return Api.instance().get('/orders', {
      params: {
        restaurant_id: restaurantId,
        order_status: orderStatus,
      },
    });
  }

  static orderCreate(restaurantId, addressId, isPublic, joinLimit) {
    return Api.instance().post('/orders', {
      restaurant_id: restaurantId,
      address_id: addressId,
      is_public: isPublic,
      join_limit: joinLimit,
    });
  }

  static singleOrderCreate(restaurantId){
    return Api.instance().post('/orders', restaurantId);
  }

  static orderCancel(orderId) {
    return Api.instance().delete(`/orders/${orderId}`);
  }

  /* --- Checkout --- */
  static orderCheckout (orderId) {
    return Api.instance().post(`/orders/${orderId}/checkout`);
  }

  /* --- Pay --- */
  static orderPay(orderId, tip, cardId) {
    return Api.instance.post(`/orders/${orderId}/pay`, {
      params: {
        tip: tip,
        cardId: cardId,
      },
    });
  }
  /* --- Notification --- */
  // using mock data
  static notificationList() {
    return new Promise((resolve, _reject) => {
      resolve({ data: { notifications: mockNotifications } });
    });
  }

  static notificationMarkRead(notificationId) {
    return new Promise((resolve, reject) => {
      const notification = mockNotifications.find(item => item.id === notificationId);
      if (notification) {
        notification.isRead = true;
        resolve({ data: { notifications: mockNotifications } });
      } else {
        reject(new Error(`Id${notificationId} does not exist.`));
      }
    });
  }

  static notificationMarkAllRead() {
    return new Promise((resolve, _reject) => {
      mockNotifications.forEach((notification) => {
        notification.isRead = true; // eslint-disable-line no-param-reassign
      });
      resolve({ data: { notifications: mockNotifications } });
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
