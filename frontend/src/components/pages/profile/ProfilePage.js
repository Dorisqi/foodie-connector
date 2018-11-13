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
import AddressDialog from 'components/address/AddressDialog';
import CardDialog from 'components/card/CardDialog';
import ProfileItem from 'components/profile/ProfileItem';

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
  card: {
    marginBottom: 2 * theme.spacing.unit,
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
  itemActions: {
    paddingTop: 0,
    justifyContent: 'flex-end',
  },
  itemDelete: {
    color: theme.palette.error.main,
  },
});

class ProfilePage extends React.Component {
  state = {
    profile: null,
    cards: null,
    orders: null,
    changingPassword: false,
    loadingProfile: null,
    loadingAddress: null,
    loadingCard: null,
    addingAddress: false,
    addingCard: false,
  };

  componentDidMount() {
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

  handleDialogClose = () => {
    this.setState({
      changingPassword: false,
      addingAddress: false,
      addingCard: false,
    });
  };

  handleAddAddressClick = () => {
    this.setState({
      addingAddress: true,
    });
  };

  handleAddCardClick = () => {
    this.setState({
      addingCard: true,
    });
  };

  addressDeleteApi = address => () => Api.addressDelete(address.id);

  addressSetDefaultApi = address => () => Api.addressSetDefault(address.id);

  cardDeleteApi = card => () => Api.cardDelete(card.id);

  cardSetDefaultApi = card => () => Api.cardSetDefault(card.id);

  handleAddressUpdate = (res) => {
    store.dispatch(loadAddress(res.data));
  };

  handleCardUpdate = (res) => {
    this.setState({
      cards: res.data,
    });
  };

  render() {
    const { classes, addresses } = this.props;
    const {
      loadingProfile,
      loadingAddress,
      loadingCard,
      loadingOrders,
      profile,
      cards,
      orders,
      changingPassword,
      addingAddress,
      addingCard,
    } = this.state;
    return (
      <MainContent title="Profile">
        <div className={classes.root}>
          <div className={classes.section}>
            <Card className={classes.card}>
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
                    && <ChangePassword onClose={this.handleDialogClose} />
                    }
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className={classes.card}>
              <CardContent className={classes.sectionTitleWrap}>
                <Typography className={classes.sectionTitle} variant="h5" component="h2">
                  Past Orders
                </Typography>
                {loadingOrders
                && <LinearProgress />
                }
              </CardContent>
              {orders !== null
              && (
                <List>
                  {orders.map(order => (
                    <ListItem
                      button
                      key={order.id}
                    >
                      <ListItemText
                        primary={order.time}
                        secondary={`Total cost ${order.cost}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )
              }
            </Card>
          </div>
          <div className={classes.section}>
            <Card className={classes.card}>
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
                  {addingAddress
                  && (
                  <AddressDialog
                    onClose={this.handleDialogClose}
                    onUpdate={this.handleAddressUpdate}
                  />
                  )
                  }
                  <ListItem button onClick={this.handleAddAddressClick}>
                    <ListItemText primary="Add New Address" />
                  </ListItem>
                  {addresses.map((address) => {
                    const line2 = address.line_2.length > 0 ? `${address.line_2}, ` : '';
                    const formattedAddress = `${address.line_1}, ${line2}${address.city}, ${address.state} ${address.zip_code}`;
                    return (
                      <ProfileItem
                        key={address.id}
                        item={address}
                        type="address"
                        alias={address.name}
                        deleteApi={this.addressDeleteApi(address)}
                        setDefaultApi={this.addressSetDefaultApi(address)}
                        onUpdate={this.handleAddressUpdate}
                        updatingDialog={AddressDialog}
                      >
                        <ListItemText
                          primary={address.name}
                          secondary={formattedAddress}
                        />
                      </ProfileItem>
                    );
                  })}
                </List>
              )
              }
            </Card>
          </div>
          <div className={classes.section}>
            <Card className={classes.card}>
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
                  {addingCard
                  && (
                  <CardDialog
                    onClose={this.handleDialogClose}
                    onUpdate={this.handleCardUpdate}
                  />
                  )
                  }
                  <ListItem button>
                    <ListItemText
                      primary="Add New Card"
                      onClick={this.handleAddCardClick}
                    />
                  </ListItem>
                  {cards.map(card => (
                    <ProfileItem
                      key={card.id}
                      item={card}
                      type="card"
                      alias={card.nickname}
                      deleteApi={this.cardDeleteApi(card)}
                      setDefaultApi={this.cardSetDefaultApi(card)}
                      onUpdate={this.handleCardUpdate}
                      updatingDialog={CardDialog}
                    >
                      <ListItemText
                        primary={card.nickname}
                        secondary={`${card.brand} card ends with ${card.last_four}`}
                      />
                    </ProfileItem>
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
