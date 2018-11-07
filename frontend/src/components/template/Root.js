import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Routes from 'components/Routes';
import Header from './Header';

const styles = () => ({
  wrapper: {
    boxSizing: 'border-box',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 1200,
    paddingLeft: 20,
    paddingRight: 20,
    width: '100%',
  },
  content: {
    marginTop: 90,
  },
});

class Root extends React.Component {
  render() {
    const { classes, location } = this.props;
    const withHeader = location.pathname !== '/login';

    return (
      <div>
        {withHeader
          && <Header wrapperClassName={classes.wrapper} />
        }
        <div className={withHeader
            ? classNames(classes.wrapper, classes.content)
            : null
          }>
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
