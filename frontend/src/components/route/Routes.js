import React from 'react';
import { Route, Switch } from 'react-router-dom';

import LoginRegisterPage from 'components/pages/auth/LoginRegisterPage';
import ResetPasswordPage from 'components/pages/auth/ResetPasswordPage';
import LogoutPage from 'components/pages/auth/LogoutPage';

import ProfilePage from 'components/pages/profile/ProfilePage';

import RestaurantListPage from 'components/pages/restaurant/RestaurantListPage';
import RestaurantDetailPage from 'components/pages/restaurant/RestaurantDetailPage';
import OrderHistoryPage from 'components/pages/orders/OrderHistoryPage';
import NearbyOrdersPage from 'components/pages/orders/NearbyOrdersPage';
import OrderDetailPage from 'components/pages/orders/OrderDetailPage';

import CheckoutPage from 'components/pages/checkout/CheckOutPage';
import DirectCheckout from 'components/pages/directcheckout/DirectCheckout';
import PaymentPage from 'components/pages/payment/PaymentPage';

import NotFoundPage from 'components/pages/error/NotFoundPage';


import PrivateRoute from './PrivateRoute';

const Routes = () => (
  <Switch>
    <Route path="/login" component={LoginRegisterPage} />
    <Route path="/register" component={LoginRegisterPage} />
    <Route path="/reset-password" component={ResetPasswordPage} />
    <PrivateRoute path="/logout" component={LogoutPage} />

    <PrivateRoute path="/profile" component={ProfilePage} />
    <PrivateRoute path="/orders/:id/checkout" component={CheckoutPage} />
    <PrivateRoute path="/orders/:id/pay" component={PaymentPage} />
    <PrivateRoute path="/" exact component={RestaurantListPage} />
    <PrivateRoute path="/restaurants/:id" component={RestaurantDetailPage} />
    <PrivateRoute path="/order-history" component={OrderHistoryPage} />
    <PrivateRoute path="/nearby-orders" component={NearbyOrdersPage} />
    <PrivateRoute path="/orders/:id" component={OrderDetailPage} />
    <PrivateRoute path="/orders/direct-checkout" component={DirectCheckout} />
    <Route component={NotFoundPage} />
  </Switch>
);

export default Routes;
