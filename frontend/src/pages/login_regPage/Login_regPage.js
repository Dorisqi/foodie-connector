import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

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
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
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
   <Typography component="main" style={{ padding: 1 * 1 }}>
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
        username:'',
        email:'',
        password:'',
        retyped_password:'',
    };
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleRetypePassword = this.handleRetypePassword.bind(this);
    this.handleLogInEmail = this.handleLogInEmail.bind(this);
    this.handleLogInPassword = this.handleLogInPassword.bind(this);
    this.handleSignup = this.handleSignup.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleRest = this.handleRest.bind(this);
  }
  handleChange = (event, value) => {
      this.setState({ value });
    };

  handleLogInEmail = (event, value) => {
    this.setState({email: event.target.value});
  }
  handleLogInPassword = (event, value) => {
    this.setState({password: event.target.value});
  }
  handleEmail = (event, value) => {
    this.setState({email: event.target.value});
    /*const mathces = this.state.password === this.state.retyped_password;
    alert("password:" + this.state.password);
    alert("retyped_password: " + this.state.retyped_password);*/
    //mathces ? alert("Success!") : alert("Please re-enter your password!")
  }
  handlePassword = (event, value) => {
    this.setState({password: event.target.value});
  }
  handleRetypePassword = (event, value) => {
    this.setState({retyped_password: event.target.value});
  }
  handleSignup = (event, value) => {
    const mathces = this.state.password === this.state.retyped_password;
    if (mathces)
    {
      alert("Success!");
      window.location = '/restaurantlist'
    }
    else {

      alert("Please re-enter your password!");
    }
    this.setState({value});
  }
  handleLogin = (event, value) => {
    //if password is correct, redireft to browse page;
    if(true)
    {
      window.location.href = "/restaurantlist";
    }
    this.setState({value});
  }
  handleRest = (event, value) => {
    this.setState({value});
    window.location.href = "/reset_password";
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <main className={classes.layout}>

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
        {value === 0 && <TabContainer>
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
                  className={classes.button}>
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

        {value === 1 && <TabContainer>
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
                  autoFocus/>
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
