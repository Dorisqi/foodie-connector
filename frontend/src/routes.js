import Base from './components/base/Base';
import RestaurantListPage from './pages/restaurantListPage/RestaurantListPage';
import userpw_resetPage from './pages/User_pw_resetPage/userpw_resetPage';


const routes = {
  component: Base,
  childRoutes: [
    {
      path: '/restaurantlist',
      component: RestaurantListPage,
    },
    {
    	path: '/reset_password',
    	component: userpw_resetPage,
    },
  ],
};

export default routes;
