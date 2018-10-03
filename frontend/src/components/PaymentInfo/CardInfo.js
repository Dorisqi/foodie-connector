import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },

});

class CardInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
      </div>
    )
  }
}

CardInfo.propTypes = {

  classes: PropTypes.shape({}).isRequired,
};
export default withStyles(styles)(CardInfo);
