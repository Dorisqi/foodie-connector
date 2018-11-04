import React from 'react';
import { Route } from 'react-router-dom';
import LoginRegisterPage from 'components/pages/auth/LoginRegisterPage';

const Routes = () => (
  <div>
    <Route path="/login" component={LoginRegisterPage} />
  </div>
);

export default Routes;
