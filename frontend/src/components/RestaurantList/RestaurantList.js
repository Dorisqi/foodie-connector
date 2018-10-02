import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import RestaurantCard from './RestaurantCard';

const styles = ({
  root: {
    display: 'flex',
  },
});

const RestaurantRow = (props) => {
  const { restaurants } = props;
  const row = restaurants.map(item => (
    <Grid item xs={12} sm={4}>
      <RestaurantCard key={item.id} item={item} />
    </Grid>
  ));
  return (
    <React.Fragment>
      {row}
    </React.Fragment>
  );
};

RestaurantRow.propTypes = {
  restaurants: PropTypes.arrayOf({}).isRequired,
};


const RestaurantList = (props) => {
  const { restaurantList } = props;
  const { classes } = props;
  const rows = [];
  for (let i = 0; i < restaurantList.length; i += 3) {
    rows.push(
      <Grid key={i} item container direction="row" xs={8} spacing={24} alignItems="center" justify="flex-start">
        <RestaurantRow restaurants={restaurantList.slice(i, i + 3)} />
      </Grid>,
    );
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={40} justify="space-evenly">
        {rows}
      </Grid>
    </div>
  );
};

RestaurantList.propTypes = {
  restaurantList: PropTypes.arrayOf(PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired).isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(RestaurantList);