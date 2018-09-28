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

function PwReset(props) {
  const { classes } = props;

  return (
    <React.Fragment>
      <CssBaseline />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <CardHeader style={{ textAlign: 'center' }} color="warning">Resetting My Password</CardHeader>
          <Avatar className={classes.avatar} />


          <form className={classes.form}>
            <Tooltip
              id="tooltip-right"
              title="Please include at least 1 Capital letter,1 digit!!"
              placement="right"
              classes={{ tooltip: classes.tooltip }}
            >
              <Button>Requirement</Button>
            </Tooltip>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Confirm the Emial to receive the verify code</InputLabel>
              <Input
                id="emailtem"
                name="emailtem"
                autoComplete="emailtem"
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
