import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
/*import axios from 'axios';
import Auth from '../../Auth/Auth';
import apiList from '../../apiList';*/

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
      margin: 10,

  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

class ShareViaThird extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      value: 0,
    };
    //handleer bind
    this.handleTwitter = this.handleTwitter.bind(this);
    this.handleFacebook = this.handleFacebook.bind(this);
    this.handleG = this.handleG.bind(this);
    this.handleE = this.handleE.bind(this);
  }
  handleTwitter (event) {
    window.location.href = "https://twitter.com/";
  }
  handleFacebook(event) {
    window.location.href = "https://www.facebook.com/";
  }
  handleG(event) {
    window.location.href = "https://plus.google.com/discover";
  }
  handleE(event) {
    window.location.href = "mailto:user@example.com?subject=Subject&body=Joine%20group%20order%20now!";
    this.setState({value: 0})
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
        <div className={classes.row}>
          <Avatar onClick = {this.handleFacebook}
            alt="facebook"
            src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/facebook_circle-512.png"
            className={classes.avatar}
          />
          <Avatar onClick = {this.handleTwitter}
            alt="twitter"
            src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png"
            className={classes.avatar}
          />
          <Avatar onClick = {this.handleG}
            alt="gogle+"
            src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/google_circle-512.png"
            className={classes.avatar}
          />
          <Avatar onClick = {this.handleE}
            alt="email"
            src="http://nvps.net/wp-content/uploads/2015/07/email-icon.png"
            className={classes.avatar}
          />
        </div>
    );
  }
}




ShareViaThird.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ShareViaThird);
