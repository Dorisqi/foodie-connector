import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class DocumentTitle extends React.Component {
  componentDidMount() {
    this.setTitle();
  }

  componentDidUpdate(_prevProps, _prevState, _snapshot) {
    this.setTitle();
  }

  setTitle() {
    const { title } = this.props;
    document.title = _.isNull(title)
      ? 'Foodie Connector'
      : `${title} - Foodie Connector`;
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

DocumentTitle.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element.isRequired,
};

DocumentTitle.defaultProps = {
  title: null,
};

export default DocumentTitle;
