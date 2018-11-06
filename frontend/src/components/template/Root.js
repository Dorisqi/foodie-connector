import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Routes from 'components/Routes';
import Header from './Header';

const styles = () => ({
  wrapper: {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 1200,
    width: '100%',
  },
  content: {
    marginTop: 90,
  },
});

class Root extends React.Component {
  render() {
    const { classes, location } = this.props;

    return (
      <div>
        {location.pathname !== '/login'
          && <Header wrapperClassName={classes.wrapper} />
        }
        <div className={[classes.wrapper, classes.content].join(' ')}>
          <Routes />
        </div>
      </div>
    );
  }
}

Root.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Root);
