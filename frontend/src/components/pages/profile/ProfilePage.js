import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import MainContent from 'components/template/MainContent';
import Api from 'facades/Api';
import Axios from 'facades/Axios';
import ChangePassword from 'components/profile/ChangePassword';
import InputForm from 'components/profile/InputForm';

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
    changingPassword: false,
    loadingProfile: null,
  };

  componentDidMount() {
    Axios.cancelRequest(this.state.loadingProfile);
    this.setState({
      loadingProfile: Api.profileShow().then((res) => {
        const profile = res.data;
        this.setState({
          profile,
          loadingProfile: null,
        });
      }).catch((err) => {
        this.setState({
          loadingProfile: null,
        });
        throw err;
      }),
    });
  }

  componentWillUnmount() {
    Axios.cancelRequest(this.state.loadingProfile);
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
    const { classes } = this.props;
    const { loadingProfile, profile, changingPassword } = this.state;
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
        </div>
      </MainContent>
    );
  }
}

ProfilePage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProfilePage);
