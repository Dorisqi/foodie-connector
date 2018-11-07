/*-------------------------
From https://github.com/express-labs/react-router-enzyme-context/blob/master/src/index.js
 */

import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import queryString from 'query-string';
import lodash from 'lodash';
import Auth from 'facades/Auth';

class LogoutPage extends React.Component {
  constructor(props) {
    super(props);

    const { history, location } = this.props;
    Auth.deauthenticateUser();
    const queries = queryString.parse(location.search);
    history.replace({
      pathname: '/login',
      search: lodash.isNil(queries.from)
        ? null
        : queryString.stringify({ from: queries.from }),
    });
  }

  render() {
    return (
      <LinearProgress />
    );
  }
}

LogoutPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default LogoutPage;
