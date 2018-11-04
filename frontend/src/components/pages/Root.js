import React from 'react';
import PropTypes from 'prop-types';
import Header from 'components/Header/Header';
import Routes from 'components/Routes';

class Root extends React.Component {
  render() {
    const { location } = this.props;

    return (
      <div>
        {location.pathname !== '/login'
          && <Header />
        }
        <Routes />
      </div>
    );
  }
}

Root.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default Root;
