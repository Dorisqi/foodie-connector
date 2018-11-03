import React from 'react';
import {shallow} from 'enzyme';
import CreateorderCard from '../components/GrouporderInfo/CreateorderCard';

it('CreateOrderCard', () => {
  const createOrderCard = shallow(
    <CreateorderCard restaurant_id={"1"}/>
  );
});
