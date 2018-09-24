import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import RestaurantCard from './RestaurantCard';

const RestaurantList = (props) => {
  const { restaurantList } = props;
  const list = restaurantList.map(item => (
    <Grid item key={item.id}>
      <RestaurantCard
        key={item.id}
        item={item}
      />
    </Grid>
  ));
  return (
    <div>
      <Grid container justify="space-evenly" alignItems="center">
        {list}
      </Grid>
    </div>
  );
};

RestaurantList.propTypes = {
  restaurantList: PropTypes.arrayOf({}).isRequired,
};

export default RestaurantList;
