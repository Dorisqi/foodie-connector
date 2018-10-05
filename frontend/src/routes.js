import Base from './components/Base/Base';
import RestaurantListPage from './pages/RestaurantListPage/RestaurantListPage';
import UserpwresetPage from './pages/userpw_resetPage/User_pw_resetPage';
import AddressLists from './components/UserAddress/AddressLists';
import UserprofilePage from './pages/userprofilePage/UserprofilePage';
import AddingAddress from './components/UserAddress/AddingAddress';
import Login_regPage from './pages/login_regPage/Login_regPage';
import Auth from './Auth/Auth';
const routes = {
  component: Base,
  childRoutes: [
    {
      path: '/login',
      component: Login_regPage,
    },
    {
      path: '/reset_password',
      component: UserpwresetPage,
    },
    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();
        replace('/login');
      }
    },
    {
      path: '/restaurantlist',
      getComponent: (location, callback) => {
        callback(null, RestaurantListPage);
        // if (Auth.isUserAuthenticated()) {
        //   callback(null, RestaurantListPage);
        // } else {
        //   callback(null, Login_regPage);
        // }
      }
    },
    {
      path: '/addaddress',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, AddingAddress);
        } else {
          callback(null, Login_regPage);
        }
      }
    },
    {
      path: '/userprofile',
      getComponent: (location, callback) => {
        if (Auth.isUserAuthenticated()) {
          callback(null, UserprofilePage);
        } else {
          callback(null, Login_regPage);
        }
      }
    },
  ],
};

export default routes;
