import React from 'react';
import PropTypes from 'prop-types';
import TagsFilter from './TagsFilter';
import SortOrder from './SortOrder';

class RestaurantFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  handleFilterChange(selectedTags) {
    const { onFilterChange } = this.props;
    onFilterChange(selectedTags);
  }

  handleSortChange(sortBy) {
    const { onSortChange } = this.props;
    onSortChange(sortBy);
  }

  render() {
    return (
      <div>
        <TagsFilter onFilterChange={this.handleFilterChange} />
        <SortOrder onSortChange={this.handleSortChange} />
      </div>
    );
  }
}

RestaurantFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default RestaurantFilter;
