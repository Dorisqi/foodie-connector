import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Storage from 'facades/Storage';
import Footer from 'components/template/Footer';

const styles = () => ({
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
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 400,
    padding: '150px 80px 100px',
    textAlign: 'center',
    width: '100%',
  },
  main: {
    flexGrow: 1,
  },
});

class AuthTemplate extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.image} />
        <div className={classes.content}>
          <div className={classes.main}>
            {this.props.children}
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

AuthTemplate.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]).isRequired,
};

export default withStyles(styles)(AuthTemplate);
