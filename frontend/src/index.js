import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import RestaurantListPage from './pages/restaurantListPage/RestaurantListPage';

ReactDOM.render(<RestaurantListPage />, document.getElementById('root'));
registerServiceWorker();
