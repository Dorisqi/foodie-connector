import React from 'react';
import PropTypes from 'prop-types';
import TagsFilter from './TagsFilter';

// const SortBy = (props) => {
//
// }

class RestaurantFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.props.onFilterChange(value);
  }

  render() {
    return (
      <div>
        <TagsFilter onFilterChange={this.handleChange} />
      </div>
    );
  }
}

RestaurantFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default RestaurantFilter;
