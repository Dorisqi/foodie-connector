import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import RestaurantListPage from './pages/restaurantListPage/RestaurantListPage';

ReactDOM.render(<RestaurantListPage />, document.getElementById('root'));
registerServiceWorker();
