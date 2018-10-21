import React from 'react';
import PropTypes from 'prop-types';
import TagsFilter from './TagsFilter';
import SortOrder from './SortOrder';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AddressSearchBar from './AddressSearchBar';
import NameSearchBar from './NameSearchBar';
import Card from '@material-ui/core/Card';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
    card:{
      maxWidth: 800,
      Height:50
    },
    input: {
    margin: theme.spacing.unit,
    },
});


class RestaurantFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      distanceLo: '',
      distanceHi: '',
      deliveryTimeLo: '',
      deliveryTimeHi: '',
      deliveryFeeLo: '',
      deliveryFeeHi: '',
      orderMinLo: '',
      orderMinHi: '',
      ratingLo: '',
      ratingHi: '',
    }
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFilterChange(selectedTags) {
    const { onFilterChange } = this.props;
    onFilterChange(selectedTags);
  }

  handleSortChange(sortBy) {
    const { onSortChange } = this.props;
    onSortChange(sortBy);
  }

  handleSubmit(event) {
    const { handleOtherFilter } = this.props;
    const res = Object.assign({}, this.state);

    Object.keys(res).forEach(key => {
      if (res[key] === '') {
        res[key] = '';
      }
      else {
        res[key] = Number(res[key]);
      }
    });
    handleOtherFilter(res);
    event.preventDefault();
  }

  handleNameChange(name) {
    const { handleNameChange } = this.props;
    handleNameChange(name);
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  render() {
    const { tags,classes } = this.props;

    return (

      <Card className={classes.card}>
        <NameSearchBar handleNameChange={this.handleNameChange} />
        <TagsFilter onFilterChange={this.handleFilterChange} tags={tags}/>
        <form onSubmit={this.handleSubmit}>
          <FormGroup row>
            <div>distance from:</div>
            <Input
              value={this.state.distanceLo}
              className={classes.input}
              onChange={this.handleChange('distanceLo')}
              type="number"
              inputProps={{
                'aria-label': 'Description',
              }}
            />
            <div>to</div>
            <Input
              value={this.state.distanceHi}
              className={classes.input}
              onChange={this.handleChange('distanceHi')}
              type="number"
              inputProps={{
                'aria-label': 'Description',
              }}
            />
            <div>Miles</div>
          </FormGroup>
          <FormGroup row>
            <div>delivery time from:</div>
            <Input
              value={this.state.deliveryTimeLo}
              className={classes.input}
              onChange={this.handleChange('deliveryTimeLo')}
              type="number"
              inputProps={{
                'aria-label': 'Description',
              }}
            />
            <div>to</div>
            <Input
              value={this.state.deliveryTimeHi}
              className={classes.input}
              onChange={this.handleChange('deliveryTimeHi')}
              type="number"
              inputProps={{
                'aria-label': 'Description',
              }}
            />
            <div>Minutes</div>
          </FormGroup>
          <FormGroup row>
            <div>delivery fee from: $</div>
            <Input
              value={this.state.deliveryFeeLo}
              className={classes.input}
              onChange={this.handleChange('deliveryFeeLo')}
              type="number"
              inputProps={{
                'aria-label': 'Description',
              }}
            />
            <div>to</div>
            <Input
              value={this.state.deliveryFeeHi}
              className={classes.input}
              onChange={this.handleChange('deliveryFeeHi')}
              type="number"
              inputProps={{
                'aria-label': 'Description',
              }}
            />
          </FormGroup>
          <FormGroup row>
            <div>minumum to order from: $</div>
            <Input
              value={this.state.orderMinLo}
              className={classes.input}
              onChange={this.handleChange('orderMinLo')}
              type="number"
              inputProps={{
                'aria-label': 'Description',
              }}
            />
            <div>to</div>
            <Input
              value={this.state.orderMinHi}
              className={classes.input}
              onChange={this.handleChange('orderMinHi')}
              type="number"
              inputProps={{
                'aria-label': 'Description',
              }}
            />
          </FormGroup>
          <FormGroup row>
            <div>rate from:</div>
            <Input
              value={this.state.ratingLo}
              className={classes.input}
              onChange={this.handleChange('ratingLo')}
              type="number"
              inputProps={{
                'aria-label': 'Description',
              }}
            />
            <div>to</div>
            <Input
              value={this.state.ratingHi}
              className={classes.input}
              onChange={this.handleChange('ratingHi')}
              type="number"
              inputProps={{
                'aria-label': 'Description',
              }}
            />
          </FormGroup>
          <FormControl className={classes.form} marginRight="dense" required>
            <Input type="submit" value="Get Restaurant!"/>
          </FormControl>
        </form>
        <SortOrder onSortChange={this.handleSortChange}/>
      </Card>
    );
  }
}

RestaurantFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  handleOtherFilter: PropTypes.func.isRequired,
};

export default withStyles(styles)(RestaurantFilter);
