import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MainContent from 'components/template/MainContent';
import Api from 'facades/Api';
import Axios from 'facades/Axios';
import ChangePassword from 'components/profile/ChangePassword';
import InputForm from 'components/profile/InputForm';
import { loadAddress, selectAddress } from 'actions/addressActions';
import store from 'store';

const styles = theme => ({
  root: {
    display: 'flex',
    marginLeft: -theme.spacing.unit,
    marginRight: -theme.spacing.unit,
  },
  section: {
    width: `${100 / 3}%`,
    padding: theme.spacing.unit,
  },
  sectionTitle: {
    marginBottom: theme.spacing.unit,
  },
  sectionTitleWrap: {
    paddingBottom: 0,
  },
  attributeForm: {
    display: 'flex',
  },
  margin: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class ProfilePage extends React.Component {
  state = {
    profile: null,
    cards: null,
    changingPassword: false,
    loadingProfile: null,
    loadingAddress: null,
    loadingCard: null,
  };

  componentDidMount() {
    Axios.cancelRequest(this.state.loadingProfile);
    this.setState({
      loadingProfile: Api.profileShow().then((res) => {
        this.setState({
          profile: res.data,
          loadingProfile: null,
        });
      }).catch((err) => {
        this.setState({
          loadingProfile: null,
        });
        throw err;
      }),
      loadingAddress: Api.addressList().then((res) => {
        this.setState({
          loadingAddress: null,
        });
        const addresses = res.data;
        store.dispatch(loadAddress(addresses));
        if (addresses.length === 0) {
          store.dispatch(selectAddress(0));
        } else {
          addresses.forEach((address) => {
            if (address.is_default) {
              store.dispatch(selectAddress(address.id));
            }
          });
        }
      }).catch((err) => {
        this.setState({
          loadingAddress: null,
        });
        throw err;
      }),
      loadingCard: Api.cardList().then((res) => {
        this.setState({
          cards: res.data,
          loadingCard: null,
        });
      }).catch((err) => {
        this.setState({
          loadingCard: null,
        });
        throw err;
      }),
    });
  }

  componentWillUnmount() {
    Axios.cancelRequest(this.state.loadingProfile);
    Axios.cancelRequest(this.state.loadingAddress);
    Axios.cancelRequest(this.state.loadingCard);
  }

  handleProfileChange = (profile) => {
    this.setState({
      profile,
    });
  };

  handleChangePasswordClick = () => {
    this.setState({
      changingPassword: true,
    });
  };

  handleChangePasswordClose = () => {
    this.setState({
      changingPassword: false,
    });
  };

  render() {
    const { classes, addresses } = this.props;
    const {
      loadingProfile,
      loadingAddress,
      loadingCard,
      profile,
      cards,
      changingPassword,
    } = this.state;
    return (
      <MainContent title="Profile">
        <div className={classes.root}>
          <div className={classes.section}>
            <Card>
              <CardContent>
                <Typography className={classes.sectionTitle} variant="h5" component="h2">
                  Profile
                </Typography>
                {loadingProfile !== null
                && <LinearProgress />
                }
                {profile !== null && (
                  <div>
                    <InputForm
                      className={classes.margin}
                      value={profile.name}
                      name="name"
                      label="Name"
                      api={Api.profileUpdate}
                      onChange={this.handleProfileChange}
                    />
                    <InputForm
                      className={classes.margin}
                      value={profile.email}
                      name="email"
                      label="Email"
                      api={Api.profileEmailUpdate}
                      onChange={this.handleProfileChange}
                    />
                    <Button
                      variant="outlined"
                      className={classes.margin}
                      onClick={this.handleChangePasswordClick}
                    >
                      Change Password
                    </Button>
                    {changingPassword
                      && <ChangePassword onClose={this.handleChangePasswordClose} />
                    }
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className={classes.section}>
            <Card>
              <CardContent className={classes.sectionTitleWrap}>
                <Typography className={classes.sectionTitle} variant="h5" component="h2">
                  Addresses
                </Typography>
                {loadingAddress
                  && <LinearProgress />
                }
              </CardContent>
              {addresses !== null
                  && (
                  <List>
                    <ListItem button>
                      <ListItemText primary="Add New Address" />
                    </ListItem>
                    {addresses.map(address => (
                      <ListItem
                        button
                        key={address.id}
                      >
                        <ListItemText
                          primary={address.name}
                          secondary={`${address.line_1}, ${address.line_2}, ${address.city}, ${address.state} ${address.zip_code}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  )
                }
            </Card>
          </div>
          <div className={classes.section}>
            <Card>
              <CardContent className={classes.sectionTitleWrap}>
                <Typography className={classes.sectionTitle} variant="h5" component="h2">
                  Cards
                </Typography>
                {loadingCard
                && <LinearProgress />
                }
              </CardContent>
              {cards !== null
              && (
              <List>
                <ListItem button>
                  <ListItemText primary="Add New Card" />
                </ListItem>
                {cards.map(card => (
                  <ListItem
                    button
                    key={card.id}
                  >
                    <ListItemText
                      primary={card.nickname}
                      secondary={`${card.brand} card ends with ${card.last_four}`}
                    />
                  </ListItem>
                ))}
              </List>
              )
              }
            </Card>
          </div>
        </div>
      </MainContent>
    );
  }
}

const mapStateToProps = state => ({
  addresses: state.address.addresses,
});

ProfilePage.propTypes = {
  classes: PropTypes.object.isRequired,
  addresses: PropTypes.array,
};

ProfilePage.defaultProps = {
  addresses: null,
};

export default withStyles(styles)(
  connect(mapStateToProps)(ProfilePage),
);
