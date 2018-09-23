import React from 'react';
import RestaurantCard from './RestaurantCard';
import Grid from "@material-ui/core/Grid";

class RestaurantList extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const list = this.props.restaurantList.map((item) =>
      <Grid item>
        <RestaurantCard key={item.id}
                        item={item}/>
      </Grid>
    )
    return (
      <div>
        <Grid container justify='space-evenly' alignItems='center'>
          {list}
        </Grid>
      </div>
    )
  }
}

export default RestaurantList;
