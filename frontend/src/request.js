import axios from 'axios';
import Auth from './Auth/Auth';

const request = axios.create({
  baseURL: 'https://testing.foodie-connector.delivery',
  headers: {
    Authorization: Auth.getToken(),
  }
})
export default request;
