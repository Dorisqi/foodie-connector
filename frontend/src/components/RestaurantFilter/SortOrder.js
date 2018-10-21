import React from 'react';
import PropTypes from 'prop-types';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import { withStyles } from '@material-ui/core/styles';

const orderChoices = [
  'default',
  'distance',
  'estimated_delivery_time',
  'delivery_fee',
  'order_minimum',
  'rating',
];

const styles = ({
  root: {
    display: 'flex',
  },
});


class SortOrder extends React.Component {
  constructor() {
    super();
    this.state = {
      order: 'default',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    const { onSortChange } = this.props;
    this.setState(() => {
      onSortChange(value);
      return { order: value };
    });
  }

  render() {
    const { classes } = this.props;
    const { order } = this.state;
    const radios = orderChoices.map(sortOrder => (
      <div key={sortOrder}>
        <Radio
          checked={order === sortOrder}
          onChange={this.handleChange}
          color="primary"
          value={sortOrder}
          name={sortOrder}
        />
        <FormLabel className={classes.text}>{sortOrder}</FormLabel>
      </div>
    ));
    return (
      <div className={classes.root}>
        {radios}
      </div>
    );
  }
}

SortOrder.propTypes = {
  onSortChange: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(SortOrder);
