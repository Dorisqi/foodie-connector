import React from 'react';
import PropTypes from 'prop-types';
import TagsFilter from './TagsFilter';
import SortOrder from './SortOrder';
import AddressSearchBar from './AddressSearchBar';
import NameSearchBar from './NameSearchBar';

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
    const { tags } = this.props;
    return (
      <div>
        <NameSearchBar handleNameChange={this.handleNameChange} />
        <AddressSearchBar onSubmit={this.handleSubmit} />
        <TagsFilter onFilterChange={this.handleFilterChange} tags={tags}/>
        <SortOrder onSortChange={this.handleSortChange} />
      </div>
    );
  }
}

RestaurantFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default RestaurantFilter;
