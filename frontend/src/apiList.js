import axios from 'axios';
import Auth from './Auth/Auth';

axios.defaults.baseURL = 'https://testing.foodie-connector.delivery';
axios.defaults.headers.common['Authorization'] = Auth.getToken();

const apiList = {
  login: '/api/v1/auth/login',
  register: '/api/v1/auth/register',
  resendVerificationEmail: '/api/v1/auth/resend-verification-email',
  resetPassword: '/api/v1/auth/reset-password',
  resetPasswordEmail: '/api/v1/auth/reset-password-email',
  verifyEmail: '/api/v1/auth/verify-email',
  profile: '/api/v1/profile',
  profileEmail: '/api/v1/profile/email',
  profilePassword: '/api/v1/profile/password',
  addresses: '/api/v1/addresses',
  addressDetail: '/api/v1/addresses/',
  card: '/api/v1/cards',
  cardDetail: '/api/v1/cards/',
}

export default apiList;
