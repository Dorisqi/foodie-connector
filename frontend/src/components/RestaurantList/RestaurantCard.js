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
    padding: '5px 5px',
    fontSize: '11px',
  },
  resize: {
    width: '350px',
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
  card: {
    margin: '30px 30px 30px 30px',
  },
});

const RestaurantCard = (props) => {
  const { item, classes } = props;
  console.log(classes);
  const tags = item.tags.join(', ');
  const labels = {
    distance: `${item.distance} mile`,
    time: `${item.estimate_time_lo} - ${item.estimate_time_hi} mins`,
    fee: `$${item.delivery_fee} Fee`,
    minimum: `$${item.order_minimum} Minimum`,
  };

  return (
    <Card className={classes.card} component="div">
      <CardActionArea className={classes.actionArea}>
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
              {`${item.rate}%`}
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
