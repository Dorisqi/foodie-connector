import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LoginRegisterPage from 'components/pages/auth/LoginRegisterPage';
import ResetPasswordPage from 'components/pages/auth/ResetPasswordPage';
import LogoutPage from 'components/pages/auth/LogoutPage';

import ProfilePage from 'components/pages/profile/ProfilePage';

import RestaurantListPage from 'components/pages/restaurant/RestaurantListPage';
import RestaurantDetailPage from 'components/pages/restaurant/RestaurantDetailPage';

import NotFoundPage from 'components/pages/error/NotFoundPage';

import PrivateRoute from './PrivateRoute';

const Routes = () => (
  <Switch>
    <Route path="/login" component={LoginRegisterPage} />
    <Route path="/register" component={LoginRegisterPage} />
    <Route path="/reset-password" component={ResetPasswordPage} />
    <PrivateRoute path="/logout" component={LogoutPage} />

    <PrivateRoute path="/profile" component={ProfilePage} />

    <PrivateRoute path="/" exact component={RestaurantListPage} />
    <PrivateRoute path="/restaurants/:id" component={RestaurantDetailPage} />

    <Route component={NotFoundPage} />
  </Switch>
);

export default Routes;
