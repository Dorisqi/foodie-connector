import Base from './components/base/Base';
import RestaurantListPage from './pages/restaurantListPage/RestaurantListPage';
import UserpwresetPage from './pages/userpw_resetPage/User_pw_resetPage';
import AddingAddress from './components/UserAddress/AddingAddress';
import UserprofilePage from './pages/userprofilePage/UserprofilePage';

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
      component: AddingAddress,
    },
    {
      path: '/userprofile',
      component: UserprofilePage,
    },
  ],
};

export default routes;
