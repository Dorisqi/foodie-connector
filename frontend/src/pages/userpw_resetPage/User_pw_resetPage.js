import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';


// core components
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from '@material-ui/core/Tooltip';
import CardHeader from '../../material-kit/components/Card/CardHeader';
import Button from '../../material-kit/components/CustomButtons/Button';



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
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  bigAvatar: {
    width: 60,
    height: 60,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

function handleConfirm() {
  

}
function handleChange1() {
  //event.preventDefault();
  const match = this.state.newpw1 ===this.state.newpw2;
  match ? alert("matched") : alert("please match new password!")

  //alert("confirm");
 //this.setState({oldpw: event.target.value});
}

function PwReset(props) {
  const { classes } = props;


  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <CardHeader style={{ textAlign: 'center' }} color="warning">Resetting My Password</CardHeader>
          <Avatar
        alt="login"
        src="https://cdn1.iconfinder.com/data/icons/navigation-elements/512/user-login-man-human-body-mobile-person-512.png"
        className={classes.avatar, classes.bigAvatar}
      />

          <Tooltip
            id="tooltip-right"
            title="Please include at least 1 Capital letter,1 digit!!"
            placement="bottom"
            classes={{ tooltip: classes.tooltip }}
          >
            <svg xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z"/>
                </svg>
          </Tooltip>
          <form className={classes.form}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Confirm the Emial to receive the verify code</InputLabel>
              <Input
                id="emailtem"
                name="emailtem"
                autoComplete="emailtem"
                //onChange={handleChange1}
                autoFocus
              />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Enter New Password</InputLabel>
              <Input
                name="newpw"
                type="password"
                id="newpassword"

                autoComplete="newpassword"
              />

            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Enter New Password again</InputLabel>
              <Input
                name="newpw2"
                type="password"
                id="newpassword2"
                autoComplete="newpassword2"
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="raised"
              color="primary"
              className={classes.submit}
              onClick={handleConfirm()}
            >
              Confirm Changes
            </Button>
          </form>
        </Paper>
      </main>
    </React.Fragment>
  );
}

PwReset.propTypes = {
  classes: PropTypes.element.isRequired,
};

export default withStyles(styles)(PwReset);
