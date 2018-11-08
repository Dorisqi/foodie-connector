import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import queryString from 'query-string';

import LoginRegisterPage from 'components/pages/auth/LoginRegisterPage';
import ResetPasswordPage from 'components/pages/auth/ResetPasswordPage';
import LogoutPage from 'components/pages/auth/LogoutPage';

import RestaurantListPage from 'components/pages/restaurant/RestaurantListPage';

import NotFoundPage from 'components/pages/error/NotFoundPage';

import Auth from 'facades/Auth';

const Routes = () => (
  <Switch>
    <Route path="/login" component={LoginRegisterPage} />
    <Route path="/register" component={LoginRegisterPage} />
    <Route path="/reset-password" component={ResetPasswordPage} />
    <PrivateRoute path="/logout" component={LogoutPage} />

    <PrivateRoute path="/" exact component={RestaurantListPage} />

    <Route component={NotFoundPage} />
  </Switch>
);

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props => (Auth.isUserAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
            search: props.location.pathname === '/logout'
              ? null
              : queryString.stringify({ from: props.location.pathname }),
          }}
        />
      ))
      }
    />
  );
}

export default Routes;
