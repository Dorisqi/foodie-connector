import React from 'react';
import PropTypes from 'prop-types';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


class TagsFilter extends React.Component {
  constructor(props) {
    super(props);
    const { tags } = this.props;
    this.state = {
      tags: [{id: 0, name: 'All'}],
      selectedTags: ['All'],
    }
    this.handleChange = this.handleChange.bind(this);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.tags !== this.props.tags) {
  //     this.setState({
  //       tags: ['All', ...nextProps.tags],
  //       selectedTags: ['All', ...nextProps.tags],
  //     })
  //   }
  // }
  componentWillReceiveProps(nextProps) {
    if (this.state.tags.length === 1) {
      const { tags } = nextProps;
      console.log(tags);
      this.setState({
        tags: [{id: 0, name: 'All'}].concat(tags),
        selectedTags: ['All'].concat(tags.map(t => t.name))
      });
    }
  }

  handleChange(event) {
    const { value, checked } = event.target;
    const { onFilterChange } = this.props;
    const { tags } = this.state;
    if (value === 'All') {
      this.setState(() => {
        const selectedTags = checked? tags.map(t => t.name): [];
        if (checked) {
          onFilterChange(tags)
        }
        else {
          onFilterChange([]);
        }
        return { selectedTags: selectedTags };
      });
    } else {
      if (!checked) {
        this.setState((state) => {
          const { selectedTags } = state;
          const newTags = selectedTags.filter(t => !(t === 'All' || t === value));
          onFilterChange(tags.filter(t => newTags.includes(t.name)));
          return { selectedTags: newTags };
        })
      }
      else {
        this.setState((state) => {
          const { selectedTags } = state;
          const newTags = [...selectedTags, value];
          if (newTags.length === tags.length - 1) {
            newTags.push('All');
          }
          onFilterChange(tags.filter(t => newTags.includes(t.name)));
          return { selectedTags: newTags };
        })

      }
    }
  }

  render() {
    const { tags, selectedTags } = this.state;
    const checkboxes = tags.map(t => (
      <FormControlLabel
        key={t.name}
        control={(
          <Checkbox
            checked={selectedTags.includes(t.name)}
            onChange={this.handleChange}
            value={t.name}
            color="primary"
          />
      )}
        label={t.name}
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
