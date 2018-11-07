import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl/FormControl';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button';
import orange from '@material-ui/core/colors/orange';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import lodash from 'lodash';
import Auth from 'facades/Auth';
import Api from 'facades/Api';
import Form from 'facades/Form';
import InputTextField from 'components/form/InputTextField';
import FormErrorMessages from 'components/form/FormErrorMessages';
import AuthTemplate from './AuthTemplate';

const styles = theme => ({
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 30,
  },
  tabs: {
    marginBottom: 20,
  },
  warningText: {
    color: orange['500'],
  },
  margin: {
    margin: theme.spacing.unit,
  },
  formError: {
    fontSize: '1rem',
  },
  forgetPasswordControl: {
    flexDirection: 'row',
    justifyContent: 'end',
  },
  submitButton: {
    marginTop: 2 * theme.spacing.unit,
  },
});

class LoginRegisterPage extends React.Component {
  state = {
    tab: 'login',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    errors: [],
  };

  handleTabChange = (_, tab) => {
    this.setState({
      tab,
      errors: [],
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.tab === 'login') {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  };

  handleLogin() {
    this.setState({
      errors: [],
    });
    Api.login({
      email: this.state.email,
      password: this.state.password,
    }).then((res) => {
      Auth.authenticateUser(res.data.api_token, res.data.user.email);
      Auth.redirect(this.props.history, this.props.location);
    }).catch(Form.handleErrors(this));
  }

  handleRegister() {
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({
        errors: {
          confirmPassword: 'The passwords do not match.',
        },
      });
      return;
    }
    Api.register({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    }).then((res) => {
      Auth.authenticateUser(res.data.api_token, res.data.user.email);
      Auth.redirect(this.props.history, this.props.location);
    }).catch(Form.handleErrors(this));
  }

  render() {
    const { classes, location } = this.props;
    const queries = queryString.parse(location.search);
    const showWarningText = !lodash.isNil(queries.from);

    return (
      <AuthTemplate>
        <Typography variant="h4" className={classes.title}>
          Foodie Connector
        </Typography>
        <Typography
          variant="subtitle1"
          className={classes.subtitle}
          color="textSecondary"
        >
          Log in to enjoy food with your neighbors and friends
        </Typography>
        <Tabs
          value={this.state.tab}
          onChange={this.handleTabChange}
          textColor="primary"
          centered
          className={classes.tabs}
        >
          <Tab value="login" label="Log In" />
          <Tab value="register" label="Sign Up" />
        </Tabs>
        <form onSubmit={this.handleSubmit}>
          {showWarningText
            && (
            <Typography className={classes.warningText} variant="body1" component="p">
              Please login or register.
            </Typography>
            )
          }
          <FormErrorMessages errors={this.state.errors.form} />
          {this.state.tab === 'register'
          && (
          <InputTextField
            parent={this}
            name="name"
            label="Name"
          />
          )
          }
          <InputTextField
            parent={this}
            name="email"
            label="Email"
            type="email"
          />
          <InputTextField
            parent={this}
            name="password"
            label="Password"
            type="password"
          />
          {this.state.tab === 'register'
          && (
          <InputTextField
            parent={this}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
          />
          )
          }
          {this.state.tab === 'login'
          && (
          <FormControl
            className={`${classes.margin} ${classes.forgetPasswordControl}`}
            fullWidth
          >
            <Button color="primary" component={Link} to="/reset-password">
              Forgot your password?
            </Button>
          </FormControl>
          )
          }
          <FormControl className={[classes.margin, classes.submitButton].join(' ')} fullWidth>
            <Button type="submit" variant="contained" color="primary">
              {this.state.tab === 'login' ? 'Log In' : 'Sign Up'}
            </Button>
          </FormControl>
        </form>
      </AuthTemplate>
    );
  }
}

LoginRegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default withStyles(styles)(LoginRegisterPage);
