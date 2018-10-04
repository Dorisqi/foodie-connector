import React from 'react';
import PropTypes from 'prop-types';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CurrentGeolocation from '../../components/currentLocation/CurrentLocation';
import axios from 'axios';
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';
import { browserHistory } from 'react-router';


const styles = theme => ({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,

      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  tabs: {
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

function TabContainer(props) {

//const { children } = props;

 return (
   <Typography component="main"
                color="default"
                style={{ padding: 1 * 1 }}>
      {props.children}
    </Typography>
 );
}

class SimpleTabs extends React.Component {

  constructor(props)
  {
    super(props);
    this.state = {
        value: 0,
        name:'',
        email:'',
        password:'',
        retyped_password:'',
        errorMessage: '',
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleRetypePassword = this.handleRetypePassword.bind(this);
    this.handleLogInEmail = this.handleLogInEmail.bind(this);
    this.handleLogInPassword = this.handleLogInPassword.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRest = this.handleRest.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleName = this.handleName.bind(this);
  }

  handleChange (event, value) {
      this.setState({ value });
    };

  handleLogInEmail (event, value) {
    this.setState({email: event.target.value});
  }
  handleLogInPassword (event, value) {
    this.setState({password: event.target.value});
  }
  handleEmail (event)  {
    this.setState({email: event.target.value});
  }
  handleName (event)  {
    this.setState({name: event.target.value});
  }
  handlePassword (event) {
    this.setState({password: event.target.value});
  }
  handleRetypePassword (event) {
    this.setState({retyped_password: event.target.value});
  }
  handleSignup (event, value) {
    event.preventDefault();
    const mathces = this.state.password === this.state.retyped_password;
    event.preventDefault;
    if (mathces)
    {
      const { name, email, password } = this.state;
      axios.post(apiList.register, {
        name: name,
        email: email,
        password: password
      }).then(res => {
        console.log(res);
        console.log(res.api_token, email);

        window.location.href = "http://localhost:3000/restaurantlist";
        Auth.authenticateUser(res.api_token, email);

      }).catch(err => {
        const { response } = err;
        if (response) {
          if (response.status === 409) {
            //TOOD
            //this.setState({value: 1});
            this.setState({ errorMessage: ''})
            alert("The email has already been taken.");
          }
          else if (response.status === 422) {
            this.setState({value: 1});
            this.setState({ errorMessage: '' })
            alert("The password must be a valid password");
          }
          else {
            console.log(err);
          }
        }
        else {
          this.setState({value: 1});
          console.log(err);
        }
        this.setState({redirect: false});
      })
    }
    else {
      alert("Please re-enter your password!");
    }
  }
  handleLogin (event) {
    //if password is correct, redireft to browse page;
    const { email, password } = this.state;
    axios.post(apiList.login, {
      email: email,
      password: password
    }).then(res => {
      console.log(res)
      Auth.authenticateUser(res.api_token, email);
      window.location.href = "/restaurantlist";
    }).catch(err => {
      const { response } = err;
      if (response) {
        if (response.status === 401) {

        }
        else if (response.status === 422) {

        }
        else if (response.status === 429) {

        }
        else {
          console.log(err);
        }
      }
      else {
        console.log(err);
      }
    })
  }
  handleRest (event, value) {
    this.setState({value});
    window.location.href ="http://localhost:3000/reset_password"
  }
  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <main className={classes.layout}>
        <CurrentGeolocation/>
          <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
          >
            <Tab label="Log In" />
            <Tab label="Sign Up" />
          </Tabs>
        {value == 0 && <TabContainer>
          <Paper className={classes.paper}>
            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  value = {this.state.email}
                  onChange = {this.handleEmail}
                  autoFocus />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value = {this.state.password}
                  onChange={this.handlePassword}
                />
              </FormControl>
              <Button onClick={this.handleRest}
                  type="submit"
                  color="primary"
                  variant="contained"
                  size="small"
                  className={classes.button}
              >
                  Forget Password?
                </Button>
              <Button onClick={this.handleLogin}
                type="submit"
                fullWidth
                variant="raised"
                color="primary"
                className={classes.submit}
              >
                Log In
              </Button>
            </form>
          </Paper>
        </TabContainer>}

        {value == 1 && <TabContainer>
          <Paper className={classes.paper}>
            <form className={classes.form}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="name">Username</InputLabel>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value = {this.state.name}
                  onChange = {this.handleName}
                  autoFocus/>
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  id="email"
                  name="email"
                  autoComplete="email"
                  value = {this.state.email}
                  onChange = {this.handleEmail}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">New Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  value = {this.state.password}
                  onChange={this.handlePassword}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Confirm New Password</InputLabel>
                <Input
                  name="retyped_password"
                  type="password"
                  id="password"
                  value = {this.state.retyped_password}
                  onChange = {this.handleRetypePassword}
                  autoComplete="current-password"
                />
              </FormControl>
              <Button onClick={this.handleSignup}
                type="submit"
                fullWidth
                variant="raised"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
            </form>
          </Paper>
          </TabContainer>}
      </main>
    );
  }
}


TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};
SimpleTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTabs);
