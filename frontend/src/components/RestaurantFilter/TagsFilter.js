import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const TAGS = [
  'Wings',
  'Pizza',
  'Fast Food',
  'Chinese',
  'Thai',
  'Mexican',
];


function initAllTags(bool) {
  return TAGS.reduce((o, val) => {
    o[val] = bool;
    return o;
  }, {
    tags: ['All'].concat(TAGS),
    All: bool,
  });
}

class TagsFilter extends React.Component {
  constructor() {
    super();
    this.state = initAllTags(true);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { value, checked } = event.target;
    const { onFilterChange } = this.props;
    const { tags } = this.state;
    if (value === 'All') {
      this.setState(() => {
        onFilterChange(checked ? tags : []);
        return initAllTags(checked);
      });
    } else {
      if (!checked) {
        this.setState({ All: checked });
      }
      this.setState((state) => {
        state[value] = checked;
        onFilterChange(tags.filter(t => state[t]));
        return { [value]: checked };
      });
    }
  }

  render() {
    const { tags } = this.state;
    const { state } = this;
    const checkboxes = tags.map(item => (
      <FormControlLabel
        key={item}
        control={(
          <Checkbox
            checked={state[item]}
            onChange={this.handleChange}
            value={item}
            color="primary"
          />
      )}
        label={item}
      />
    ));
    return (
      <FormGroup row={true}>
        {checkboxes}
      </FormGroup>
    );
  }
}

TagsFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default TagsFilter;
