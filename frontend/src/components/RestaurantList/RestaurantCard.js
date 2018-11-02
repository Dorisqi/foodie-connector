import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import Button from 'components/CustomButtons/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  label: {
    margin: theme.spacing.unit,
    marginRight: theme.spacing.unit / 3,
    padding: '5px 5px',
    fontSize: '9px',
  },
  resize: {
    width: theme.spacing.unit * 36.5,
    height: '200px',
  },
  restaurantName: {
    marginLeft: '10px',
  },
  thumbUpRate: {
    marginRight: '20px',
    color: 'red',
  },
  tags: {
    marginLeft: '15px',
    color: '#CBBFBF',
  },
  rateText: {
    marginTop: '2px',
    marginRight: '15px',
    marginLeft: '4px',
    float: 'right',
    fontSize: '15px',
  },
  thumbUp: {
    float: 'right',
  },
});

const RestaurantCard = (props) => {
  const { item, classes } = props;
  const tags = item.categories.join(', ');
  const labels = {
    distance: `${item.distance} mile`,
    time: `${item.estimated_delivery_time} mins`,
    fee: `$${item.delivery_fee} Fee`,
    minimum: `$${item.order_minimum} Minimum`,
  };

  return (
    <Card className={classes.card} component="div">
      <CardActionArea className={classes.actionArea} href={"/restaurant/"+item.id}>
        <CardMedia
          className={classes.resize}
          component="img"
          image={item.image}
          title={item.name}
        />
        <Typography gutterBottom>
          <h2 className={classes.restaurantName}>
            {item.name}
            <span className={classes.rateText}>
              {item.rating}
            </span>
            <Icon className={classes.thumbUp} fontSize="small" color="secondary">
              thumb_up
            </Icon>
          </h2>
          <p className={classes.tags}>{tags}</p>

        </Typography>

        <div className={classes.labelList}>
          <Button className={classes.label} disableRipple disabled>
            {labels.distance}
          </Button>
          <Button className={classes.label} disableRipple disabled>
            {labels.time}
          </Button>
          <Button className={classes.label} disableRipple disabled>
            {labels.fee}
          </Button>
          <Button className={classes.label} disableRipple disabled>
            {labels.minimum}
          </Button>
        </div>
      </CardActionArea>
    </Card>
  );
};

RestaurantCard.propTypes = {
  item: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(RestaurantCard);
