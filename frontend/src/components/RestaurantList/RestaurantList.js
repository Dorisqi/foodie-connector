import React from 'react';
import PropTypes from 'prop-types';
import GridContainer from 'components/Grid/GridContainer';
import RestaurantCard from './RestaurantCard';

const RestaurantList = (props) => {
  const { restaurantList } = props;
  const list = restaurantList.map(item => (
    <GridContainer item key={item.id}>
      <RestaurantCard
        key={item.id}
        item={item}
      />
    </GridContainer>
  ));
  return (
    <div>
      <GridContainer justify="space-evenly" alignItems="center">
        {list}
      </GridContainer>
    </div>
  );
};

RestaurantList.propTypes = {
  restaurantList: PropTypes.arrayOf(PropTypes.shape({
    tags: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  }).isRequired).isRequired,
};

export default RestaurantList;
