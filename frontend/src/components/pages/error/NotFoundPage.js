import React from 'react';
import Typography from '@material-ui/core/Typography';

class NotFoundPage extends React.Component {
  render() {
    return (
      <div>
        <Typography variant="h1">
          404
        </Typography>
        <Typography variant="h2">
          PAGE NOT FOUND
        </Typography>
      </div>
    );
  }
}

export default NotFoundPage;
