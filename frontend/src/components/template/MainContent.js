import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import DocumentTitle from 'components/template/DocumentTitle';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
  title: {
    marginBottom: 2 * theme.spacing.unit,
  },
  divider: {
    marginBottom: theme.spacing.unit,
  },
});

class MainContent extends React.Component {
  render() {
    const {
      title, classes, children, loading,
    } = this.props;

    return (
      <DocumentTitle title={title}>
        <div>
          <Typography
            className={classes.title}
            variant="h4"
            component="h1"
          >
            {title}
          </Typography>
          {loading
            ? <LinearProgress color="primary" />
            : <Divider className={classes.divider} />
          }
          {!loading && children}
        </div>
      </DocumentTitle>
    );
  }
}

MainContent.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.bool,
  ]).isRequired,
  loading: PropTypes.bool,
};

MainContent.defaultProps = {
  loading: false,
};

export default withStyles(styles)(MainContent);
