import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Routes from 'components/route/Routes';
import Snackbar from 'facades/Snackbar';
import Auth from 'facades/Auth';
import Header from './Header';
import Footer from './Footer';

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
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginTop: 90,
    flexGrow: 1,
  },
});

class Root extends React.Component {
  constructor(props) {
    super(props);

    Snackbar.inject(this.props.enqueueSnackbar);
    window.addEventListener('unhandledrejection', this.handleApiError);
    window.addEventListener('error', this.handleApiError);
  }

  handleApiError(err) {
    const reason = err.reason;
    const response = reason === undefined ? err.response : reason.response;
    if (response !== undefined && response.status === 401) {
      Auth.deauthenticateUser();
      this.forceUpdate();
      return;
    }
    const message = reason === undefined ? err.message : reason.message;
    Snackbar.error(message);
  }

  render() {
    const { classes, location } = this.props;
    const withHeader = location.pathname !== '/login'
      && location.pathname !== '/register'
      && location.pathname !== '/reset-password'
      && location.pathname !== '/logout';

    return (
      <div>
        {withHeader
        && <Header wrapperClassName={classes.wrapper} location={location} />
        }
        <div className={withHeader
          ? classNames(classes.wrapper, classes.content)
          : null
          }
        >
          <div className={withHeader
            ? classes.main
            : null
            }
          >
            <Routes className={classes.routes} />
          </div>
          {withHeader
          && <Footer />
          }
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
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withStyles(styles)(withSnackbar(Root));
