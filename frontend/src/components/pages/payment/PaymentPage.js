import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import MainContent from 'components/template/MainContent';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  subComponentTitle: {
    display: 'block',
  },
});
class PaymentPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <MainContent title="Thank you, your order has been placed">
        <Typography
          className={classes.subComponentTitle}
          variant="h6"
          component="h2"
        >
                Please check your notification box to track the order status
        </Typography>
      </MainContent>
    );
  }
}

PaymentPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  withStyles(styles),
)(withRouter(PaymentPage));
