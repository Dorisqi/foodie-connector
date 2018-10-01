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


class TagsFilter extends React.Component {
  constructor() {
    super();
    this.state = this.initAllTags(true);
    this.handleChange = this.handleChange.bind(this);
  }

  initAllTags(bool) {
    return TAGS.reduce((o, val) => {
      o[val] = bool;
      return o;
    }, {
      tags: ['All'].concat(TAGS),
      All: bool,
    });
  }

  // handleChange(event) {
  //   const { name, checked } = event.target;
  //   if (name === 'All') {
  //     this.setState((state, props) => {
  //       this.props.onFilterChange(
  //         checked
  //           ? state.tags
  //           : [],
  //       );
  //       return this.initAllTags(checked);
  //     });
  //   } else {
  //       if (!checked) {
  //         this.setState({ All: checked });
  //       }
  //       this.setState((state, props) => {
  //         state[name] = checked;
  //         this.props.onFilterChange(state.tags.filter(t => state[t]));
  //         return { [name]: checked };
  //       });
  //   }
  // }
  handleChange(event) {
    const name = event.target.value;
    const checked = event.target.checked;
    if (name === 'All') {
      this.setState((state, props) => {
        console.log(this.state);
        this.props.onFilterChange(checked ? this.state.tags : []);
        return this.initAllTags(checked);
      });
    }
    else {
        if (!checked) {
          this.setState({ All: checked });
        }
        this.setState((state, props) => {
          state[name] = checked;
          this.props.onFilterChange(state.tags.filter(t => state[t]));
          return { [name]: checked };
        });
    }
  }
  render() {
    const { tags } = this.state;
    const checkboxes = tags.map(item => (
      <FormControlLabel
        control={(
          <Checkbox
            checked={this.state[item]}
            onChange={this.handleChange}
            value={item}
            color="primary"
          />
      )}
        label={item}
      />
    ));
    return (
      <FormGroup row="row">
        {checkboxes}
      </FormGroup>
    );
  }
}

TagsFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
};

export default TagsFilter;
