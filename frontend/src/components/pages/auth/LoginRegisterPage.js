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
import _ from 'lodash';
import Auth from 'facades/Auth';
import Api from 'facades/Api';
import Form from 'facades/Form';
import InputTextField from 'components/form/InputTextField';
import FormErrorMessages from 'components/form/FormErrorMessages';
import DocumentTitle from 'components/template/DocumentTitle';
import AuthTemplate from 'components/template/AuthTemplate';

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
    name: '',
    email: '',
    password: '',
    confirmPassword: '', // eslint-disable-line react/no-unused-state
    errors: [],
  };

  handleTabChange = (_e, tab) => {
    const { history, location } = this.props;
    history.push({
      pathname: `/${tab}`,
      search: location.search,
    });
    this.setState({
      errors: [],
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      errors: [],
    });
    const { location } = this.props;
    if (location.pathname === '/login') {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  };

  handleLogin() {
    Api.login({
      email: this.state.email,
      password: this.state.password,
    })
      .then(Auth.authenticateFromResponse(this))
      .catch(Form.handleErrors(this));
  }

  handleRegister() {
    if (!Form.confirmPassword(this)) {
      return;
    }
    Api.register({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    })
      .then(Auth.authenticateFromResponse(this))
      .catch(Form.handleErrors(this));
  }

  render() {
    const { classes, location } = this.props;
    const { errors } = this.state;
    const queries = queryString.parse(location.search);
    const showWarningText = !_.isNil(queries.from);
    const isLogin = location.pathname === '/login';

    return (
      <DocumentTitle title={isLogin ? 'Log In' : 'Sign Up'}>
        <AuthTemplate>
          <Typography variant="h4" component="h1" className={classes.title}>
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
            value={isLogin ? 'login' : 'register'}
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
            <FormErrorMessages errors={errors.form} />
            {!isLogin
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
            {!isLogin
            && (
              <InputTextField
                parent={this}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
              />
            )
            }
            {isLogin
            && (
              <FormControl
                className={`${classes.margin} ${classes.forgetPasswordControl}`}
                fullWidth
              >
                <Button
                  color="primary"
                  component={Link}
                  to={{
                    pathname: '/reset-password',
                    search: location.search,
                  }}
                >
                  Forgot your password?
                </Button>
              </FormControl>
            )
            }
            <FormControl className={[classes.margin, classes.submitButton].join(' ')} fullWidth>
              <Button type="submit" variant="contained" color="primary">
                {isLogin ? 'Log In' : 'Sign Up'}
              </Button>
            </FormControl>
          </form>
        </AuthTemplate>
      </DocumentTitle>
    );
  }
}

LoginRegisterPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginRegisterPage);
