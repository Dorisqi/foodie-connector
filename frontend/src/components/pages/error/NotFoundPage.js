import React from 'react';
import Typography from '@material-ui/core/Typography';
import DocumentTitle from 'components/template/DocumentTitle';

class NotFoundPage extends React.Component {
  render() {
    return (
      <DocumentTitle title="Page Not Found">
        <div>
          <Typography variant="h1">
          404
          </Typography>
          <Typography variant="h2">
          PAGE NOT FOUND
          </Typography>
        </div>
      </DocumentTitle>
    );
  }
}

export default NotFoundPage;
