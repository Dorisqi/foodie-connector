import Base from './components/base/Base';
import RestaurantListPage from './pages/restaurantListPage/RestaurantListPage';
import UserpwresetPage from './pages/userpw_resetPage/User_pw_resetPage';
import AddressLists from './components/UserAddress/AddressLists';
import UserprofilePage from './pages/userprofilePage/UserprofilePage';
import AddingAddress from './components/UserAddress/AddingAddress';

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
      path: '/trying',
      component: AddressLists,
    },
    {
      path: '/userprofile',
      component: UserprofilePage,
    },
    {
      path: '/addaddress',
      component: AddingAddress,
    }
  ],
};

export default routes;
