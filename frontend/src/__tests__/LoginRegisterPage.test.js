import React from 'react';
import { mount } from 'enzyme';
import Tab from '@material-ui/core/Tab';
import FormHelperText from '@material-ui/core/FormHelperText';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';
import LoginRegisterPage from 'components/pages/auth/LoginRegisterPage';
import InputTextField from 'components/form/InputTextField';
import FormErrorMessages from 'components/form/FormErrorMessages';
import Test from 'facades/Test';
import ApiMock from '__mocks__/api/ApiMock';

describe('<LoginRegisterPage />', () => {
  const options = new ReactRouterEnzymeContext();

  it('switch tabs', () => {
    const wrapper = mount(
      <LoginRegisterPage />,
      options.get(),
    );
    const tabs = wrapper.find(Tab);
    tabs.forEach((tab) => {
      expect(tab.prop('selected')).toEqual(tab.prop('value') === 'login');
    });
    expect(wrapper.find(InputTextField)).toHaveLength(2);
    tabs.filter({ value: 'register' }).simulate('click');
    wrapper.find(Tab).forEach((tab) => {
      expect(tab.prop('selected')).toEqual(tab.prop('value') === 'register');
    });
    expect(wrapper.find(InputTextField)).toHaveLength(4);
  });

  it('login succeed', async () => {
    const wrapper = mount(
      <LoginRegisterPage />,
      options.get(),
    );
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    Test.fill(wrapper.find('input#password'), ApiMock.PASSWORD);
    wrapper.find('form').simulate('submit');
    await ApiMock.waitForRequest();
    wrapper.update();
    expect(wrapper.find(FormErrorMessages).find(FormHelperText)).toHaveLength(0);
    // TODO: redirect after login
    // TODO: check localstorage
  });

  it('login failed', async () => {
    const wrapper = mount(
      <LoginRegisterPage />,
      options.get(),
    );
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    Test.fill(wrapper.find('input#password'), 'wrong');
    wrapper.find('form').simulate('submit');
    await ApiMock.waitForRequest();
    wrapper.update();
    expect(wrapper.find(FormErrorMessages).find(FormHelperText)).toHaveLength(2);
  });
});
