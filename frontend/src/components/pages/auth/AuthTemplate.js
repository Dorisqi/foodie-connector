import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Storage from 'facades/Storage';

const styles = theme => ({
  root: {
    display: 'flex',
    height: '100vh',
  },
  image: {
    background: 'center center no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `url(${Storage.url('images/auth-background.jpg')})`,
    flexGrow: 1,
    height: '100%',
  },
  content: {
    backgroundColor: '#F0F4F7',
    maxWidth: 400,
    padding: '150px 80px',
    textAlign: 'center',
    width: '100%',
  },
});

class AuthTemplate extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.image} />
        <div className={classes.content}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(AuthTemplate);
