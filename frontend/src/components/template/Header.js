import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import GroupAdd from '@material-ui/icons/GroupAdd';
import FollowfriendDialog from '../friends/FollowfriendDialog'
import { withStyles } from '@material-ui/core/styles';
import { loadAddress, selectAddress } from 'actions/addressActions';


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
  card: {
    minWidth:'30',
  },
});

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleProfileMenuOpen = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleProfileMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleDialogClose = () => {
    this.setState({
      changingPassword: false,
      addingAddress: false,
      addingCard: false,
    });
  };

  render() {
    const { anchorEl } = this.state;
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

    const friendslist = (
        <FollowfriendDialog/>
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

                aria-haspopup="true"
                className={classes.accountButton}
                color="inherit"
              >
                <GroupAdd />
              </IconButton>
            </div>
            <div className={classes.rightSection}>
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
