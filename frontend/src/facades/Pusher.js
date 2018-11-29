import * as Pusherjs from 'pusher-js';
import LocalStorage from './LocalStorage';
import Auth from './Auth';

class Pusher {
  static pusherKey = process.env.REACT_APP_PUSHER_KEY;

  static authEndpoint = `${process.env.REACT_APP_API_BASE_URL}/pusher/auth`;

  static pusher = null;

  static notificationChannel = null;

  static init() {
    Pusher.pusher = new Pusherjs(Pusher.pusherKey, {
      authEndpoint: Pusher.authEndpoint,
      cluster: 'us2',
      auth: {
        headers: {
          Authorization: Auth.getToken(),
        },
      },
    });
  }

  static loadNotification(callback) {
    Pusher.notificationChannel = Pusher.pusher.subscribe(`private-user.${LocalStorage.getItem('userId')}`);
    Pusher.notificationChannel.bind('notification', callback);
  }
}


export default Pusher;
