import React from "react";
import ReactDOM from "react-dom";
import "../../material-kit/assets/scss/material-kit-react.css?v=1.2.0";
import withStyles from "@material-ui/core/styles/withStyles";
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import tooltipsStyle from "assets/jss/material-kit-react/tooltipsStyle.jsx";


// core components
import Card from "../../material-kit/components/Card/Card.jsx";
import CardBody from "../../material-kit/components/Card/CardBody.jsx";
import CardHeader from "../../material-kit/components/Card/CardHeader.jsx";
import Button from "../../material-kit/components/CustomButtons/Button.jsx";
import { cardTitle } from "../../material-kit/assets/jss/material-kit-react.jsx";
import Badge from '../../material-kit/components/Badge/Badge.jsx';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Tooltip from "@material-ui/core/Tooltip";

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
        <CardHeader style = {{textAlign: "center"}} color="warning">Resetting My Password</CardHeader>
          <Avatar className={classes.avatar}>
            
          </Avatar>
          <Avatar
        alt="userimg"
        src="https://image.freepik.com/free-icon/user-image-with-black-background_318-34564.jpg"
        className={classNames(classes.avatar, classes.bigAvatar)}
      	/>
          
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
              <InputLabel htmlFor="password">Enter Old Password</InputLabel>
              <Input id="password" name="oldpw" autoComplete="oldpw" autoFocus />
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
              color="rose"
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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PwReset);



/*class Cards extends React.Component {
  render() {
    const { classes } = this.props
    return (
    	<Card style={{width: "10rem"},{height: "10rem"}}>
        <CardHeader style = {{textAlign: "center"}} color="warning">Password Resetting</CardHeader>
        <CardBody>
        <h4 style = {{textAlign: "center"}}>Please enter your OLD password, and the NEW password!</h4>
        <Button color="rose">Confirm</Button>
        </CardBody>
      	</Card>
    );
  }
}

export default withStyles(style)(Cards);*/


