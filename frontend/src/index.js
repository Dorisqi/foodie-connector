import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { browserHistory, Router } from 'react-router';
import registerServiceWorker from './registerServiceWorker';
import routes from './routes';
import Geocode from 'react-geocode';
import apiKeys from './apiKeys';
import axios from 'axios';
import Auth from './Auth/Auth';

Geocode.setApiKey(apiKeys.googleMapAPIKey);
Geocode.enableDebug();
axios.defaults.baseURL = 'https://testing.foodie-connector.delivery';
axios.defaults.headers.common['Authorization'] = Auth.getToken();

ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.getElementById('root'),
);
registerServiceWorker();
