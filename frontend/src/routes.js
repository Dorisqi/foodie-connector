import Base from './components/Base/Base';
import RestaurantListPage from './pages/RestaurantListPage/RestaurantListPage';
import UserpwresetPage from './pages/userpw_resetPage/User_pw_resetPage';
import AddressLists from './components/UserAddress/AddressLists';
import UserprofilePage from './pages/userprofilePage/UserprofilePage';
import AddingAddress from './components/UserAddress/AddingAddress';
import Login_regPage from './pages/login_regPage/Login_regPage';

const routes = {
  component: Base,
  childRoutes: [
    {
      path: '/restaurantlist',
      component: RestaurantListPage,
    },
    {
      path: '/reset_password',
      component: UserpwresetPage,
    },
    {
      path: '/userprofile',
      component: UserprofilePage,
    },
    {
      path: '/addaddress',
      component: AddingAddress,
    },
    {
      path: '/login',
      component: Login_regPage,
    }
  ],
};

export default routes;
