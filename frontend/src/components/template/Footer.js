import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';

const style = () => ({
  footer: {
    marginTop: 30,
    marginBottom: 30,
  },
});

class Footer extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Typography className={classes.footer} variant="caption" component="div">
        Purdue University - CS307 - Fall18 - Team25
      </Typography>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(style)(Footer);
