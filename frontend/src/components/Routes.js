import React from 'react';
import { Route } from 'react-router-dom';
import LoginRegisterPage from './pages/auth/LoginRegisterPage';

class Routes extends React.Component {
  render() {
    return (
      <div>
        <Route path="/login" component={LoginRegisterPage}/>
      </div>
    );
  };
}

export default Routes;
