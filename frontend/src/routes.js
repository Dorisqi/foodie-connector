import Base from './components/base/Base';
import RestaurantListPage from './pages/restaurantListPage/RestaurantListPage';
import UserpwresetPage from './pages/userpw_resetPage/User_pw_resetPage';
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
      path: '/login',
      component: Login_regPage,
    },
  ],
};

export default routes;
