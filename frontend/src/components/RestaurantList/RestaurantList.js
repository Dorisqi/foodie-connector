import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import RestaurantCard from './RestaurantCard';

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
  const rows = [];
  for (let i = 0; i < restaurantList.length; i += 3) {
    rows.push(
      <Grid item container xs={8} spacing={24} alignItems="center" justify="space-evenly">
        <RestaurantRow restaurants={restaurantList.slice(i, i + 3)} />
      </Grid>,
    );
  }
  return (
    <div>
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
};

export default RestaurantList;
