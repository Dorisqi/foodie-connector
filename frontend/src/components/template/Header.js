import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { withStyles } from '@material-ui/core/styles';
import Pusher from 'facades/Pusher';
import NotificationDialog from './NotificationDialog';

const styles = () => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    display: 'block',
    marginLeft: -16,
  },
  titleTypography: {
    color: '#FFF',
    textTransform: 'none',
  },
  rightSection: {
    display: 'flex',
  },
  accountButton: {
    marginRight: -12,
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      notificationsOpen: false,
      notifications: [],
      unreadCount: 0,
      idCount: 0, // eslint-disable-line react/no-unused-state
    };
  }

  componentDidMount() {
    Pusher.loadNotification(this.receiveNotifications);
  }

  receiveNotifications = (data) => {
    this.setState((state) => {
      const {
        idCount, unreadCount, notifications,
      } = state;
      const notification = Object.assign({}, data.data);
      notification.isRead = false;
      notification.id = idCount;
      return {
        unreadCount: unreadCount + 1,
        notifications: [notification, ...notifications],
        idCount: idCount + 1,
      };
    });
  }

  handleDialogClose = () => {
    this.setState({ notificationsOpen: false });
  };

  handleNotificationOpen = () => {
    this.setState({ notificationsOpen: true });
  }

  handleClear = () => {
    this.setState({
      notifications: [],
      unreadCount: 0,
    });
  }

  handleMarkRead = id => () => {
    this.setState((state) => {
      state.notifications.forEach((n) => {
        if (n.id === id) n.isRead = true; /* eslint-disable-line no-param-reassign */
      });
      return {
        unreadCount: state.unreadCount - 1,
        notifications: state.notifications,
      };
    });
  }

  handleMarkAllRead = () => {
    this.setState((state) => {
      state.notifications.forEach((n) => {
        n.isRead = true; /* eslint-disable-line no-param-reassign */
      });
      return {
        unreadCount: 0,
        notifications: state.notifications,
      };
    });
  }

  handleProfileMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleProfileMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const {
      anchorEl, notificationsOpen, notifications, unreadCount,
    } = this.state;
    const { wrapperClassName, classes, location } = this.props;
    const isMenuOpen = Boolean(anchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleProfileMenuClose}
      >
        <MenuItem
          button
          component={Link}
          to={{
            pathname: '/profile',
          }}
          onClick={this.handleProfileMenuClose}
        >
          Profile
        </MenuItem>
        <MenuItem
          button
          component={Link}
          to={{
            pathname: '/order-history',
          }}
          onClick={this.handleProfileMenuClose}
        >
          Order History
        </MenuItem>
        <MenuItem
          button
          component={Link}
          to={{
            pathname: '/nearby-orders',
          }}
          onClick={this.handleProfileMenuClose}
        >
          Nearby Orders
        </MenuItem>
        {location.pathname !== '/logout'
        && (
          <MenuItem
            button
            component={Link}
            to={{
              pathname: '/logout',
              search: queryString.stringify({ from: location.pathname }),
            }}
            onClick={this.handleProfileMenuClose}
          >
            Log Out
          </MenuItem>
        )
        }
      </Menu>
    );

    return (
      <header className={classes.root}>
        <AppBar position="fixed">
          <Toolbar className={wrapperClassName}>
            <Button className={classes.title} component={Link} to="/">
              <Typography className={classes.titleTypography} variant="h5" noWrap>
                Foodie Connector
              </Typography>
            </Button>
            <div className={classes.grow} />
            <div className={classes.rightSection}>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : null}
                aria-haspopup="true"
                className={classes.accountButton}
                onClick={this.handleNotificationOpen}
                color="inherit"
              >
                {unreadCount === 0
                  ? <NotificationsIcon />
                  : (
                    <Badge
                      badgeContent={unreadCount}
                      color="primary"
                    >
                      <NotificationsIcon />
                    </Badge>
                  )
              }

              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : null}
                aria-haspopup="true"
                className={classes.accountButton}
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {notificationsOpen
          ? (
            <NotificationDialog
              open={notificationsOpen}
              notifications={notifications}
              handleMarkRead={this.handleMarkRead}
              handleMarkAllRead={this.handleMarkAllRead}
              handleClear={this.handleClear}
              onClose={this.handleDialogClose}
            />
          )
          : null
        }
      </header>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  wrapperClassName: PropTypes.string.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(Header);
