import Base from './components/base/Base';
import RestaurantListPage from './pages/restaurantListPage/RestaurantListPage';

const routes = {
  component: Base,
  childRoutes: [
    {
      path: '/restaurantlist',
      component: RestaurantListPage,
    },
  ],
};

export default routes;
