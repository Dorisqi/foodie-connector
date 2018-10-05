import React from 'react';
import PropTypes from 'prop-types';
import TagsFilter from './TagsFilter';
import SortOrder from './SortOrder';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import AddressSearchBar from './AddressSearchBar';
import NameSearchBar from './NameSearchBar';
import Card from '@material-ui/core/Card';


const styles = theme => ({
    card:{
      maxWidth: 800,
      Height:50
    }
});


class RestaurantFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  handleFilterChange(selectedTags) {
    const { onFilterChange } = this.props;
    onFilterChange(selectedTags);
  }

  handleSortChange(sortBy) {
    const { onSortChange } = this.props;
    onSortChange(sortBy);
  }

  handleSubmit(place_id) {
    const { onSubmit } = this.props;
    onSubmit(place_id);
  }

  handleNameChange(name) {
    const { handleNameChange } = this.props;
    handleNameChange(name);
  }
  render() {
    const { tags,classes } = this.props;

    return (

      <Card className={classes.card}>
        <NameSearchBar handleNameChange={this.handleNameChange} />
        <TagsFilter onFilterChange={this.handleFilterChange} tags={tags}/>
        <SortOrder onSortChange={this.handleSortChange} />

      </Card>
    );
  }
}

RestaurantFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default withStyles(styles)(RestaurantFilter);
