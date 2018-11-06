import React from 'react';
import { Route } from 'react-router-dom';
import LoginRegisterPage from 'components/pages/auth/LoginRegisterPage';
import RestaurantListPage from 'components/pages/restaurant/RestaurantListPage';

const Routes = () => (
  <div>
    <Route path="/" component={RestaurantListPage} />
    <Route path="/login" component={LoginRegisterPage} />
  </div>
);

export default Routes;
