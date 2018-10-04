import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

// const TAGS = [
//   'Wings',
//   'Pizza',
//   'Fast Food',
//   'Chinese',
//   'Thai',
//   'Mexican',
// ];


class TagsFilter extends React.Component {
  constructor(props) {
    super(props);
    const { tags } = this.props;
    this.state = {
      tags: ['All', ...tags],
      selectedTags: ['All', ...tags],
    }
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.tags !== this.props.tags) {
      this.setState({
        tags: ['All', ...nextProps.tags],
        selectedTags: ['All', ...nextProps.tags],
      })
    }
  }
  handleChange(event) {
    const { value, checked } = event.target;
    const { onFilterChange } = this.props;
    const { tags } = this.state;
    if (value === 'All') {
      this.setState(() => {
        const selectedTags = checked ? tags : [];
        onFilterChange(selectedTags);
        return { selectedTags: selectedTags };
      });
    } else {
      if (!checked) {
        const { selectedTags } = this.state;
        const res = selectedTags.filter(t => t != 'All' && t != value);
        this.setState({ selectedTags: res});
        onFilterChange(res);
      }
      else {
        const { selectedTags } = this.state;
        const res = [...selectedTags, value];
        this.setState({ selectedTags: res });
        onFilterChange(res);
      }
    }
  }

  render() {
    const { tags, selectedTags } = this.state;
    const checkboxes = tags.map(t => (
      <FormControlLabel
        key={t}
        control={(
          <Checkbox
            checked={selectedTags.includes(t)}
            onChange={this.handleChange}
            value={t}
            color="primary"
          />
      )}
        label={t}
      />
    ));
    return (
      <FormGroup row>
        {checkboxes}
      </FormGroup>
    );
  }
}

TagsFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default TagsFilter;
