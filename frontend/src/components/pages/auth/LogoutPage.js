import React from 'react';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import queryString from 'query-string';
import _ from 'lodash';
import Auth from 'facades/Auth';
import DocumentTitle from 'components/template/DocumentTitle';
import AuthTemplate from 'components/template/AuthTemplate';

class LogoutPage extends React.Component {
  componentDidMount() {
    const { history, location } = this.props;
    Auth.deauthenticateUser();
    const queries = queryString.parse(location.search);
    history.replace({
      pathname: '/login',
      search: _.isNil(queries.from)
        ? null
        : queryString.stringify({ from: queries.from }),
    });
  }

  render() {
    return (
      <DocumentTitle title="Logout">
        <AuthTemplate>
          <LinearProgress />
        </AuthTemplate>
      </DocumentTitle>
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
