import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import Auth from 'facades/Auth';

class PrivateRoute extends React.Component {
  render() {
    const { component: Component, ...rest } = this.props;
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
        ))}
      />
    );
  }
}

PrivateRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]).isRequired,
};

export default PrivateRoute;
