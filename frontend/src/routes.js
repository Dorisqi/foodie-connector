import Base from './components/base/Base';
import RestaurantListPage from './pages/restaurantListPage/RestaurantListPage';
import UserpwresetPage from './pages/userpw_resetPage/User_pw_resetPage';


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
  ],
};

export default routes;
