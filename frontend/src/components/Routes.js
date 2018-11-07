import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import LoginRegisterPage from 'components/pages/auth/LoginRegisterPage';
import RestaurantListPage from 'components/pages/restaurant/RestaurantListPage';
import Auth from 'facades/Auth';

const Routes = () => (
  <div>
    <Route path="/login" exact component={LoginRegisterPage} />
    <PrivateRoute path="/" exact component={RestaurantListPage} />
  </div>
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
            search: `?from=${props.location.pathname}`,
          }}
        />
      ))
      }
    />
  );
}

export default Routes;
