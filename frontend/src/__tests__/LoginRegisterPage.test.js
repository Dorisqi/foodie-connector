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
import Auth from 'facades/Auth';

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
    await ApiMock.waitForResponse();
    wrapper.update();
    expect(wrapper.find(FormErrorMessages).find(FormHelperText)).toHaveLength(0);
    expect(Auth.getToken()).toEqual(ApiMock.API_TOKEN);
    // TODO: redirect after login
  });

  it('login failed', async () => {
    const wrapper = mount(
      <LoginRegisterPage />,
      options.get(),
    );
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    Test.fill(wrapper.find('input#password'), 'wrong');
    wrapper.find('form').simulate('submit');
    await ApiMock.waitForResponse();
    wrapper.update();
    expect(wrapper.find(FormErrorMessages).find(FormHelperText)).toHaveLength(2);
    expect(Auth.getToken()).toEqual(null);
  });

  it('register succeed', async () => {
    const wrapper = mount(
      <LoginRegisterPage />,
      options.get(),
    );
    wrapper.find(Tab).filter({ value: 'register' }).simulate('click');
    wrapper.update();
    Test.fill(wrapper.find('input#name'), ApiMock.NAME);
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    Test.fill(wrapper.find('input#password'), ApiMock.PASSWORD);
    Test.fill(wrapper.find('input#confirmPassword'), ApiMock.PASSWORD);
    wrapper.find('form').simulate('submit');
    await ApiMock.waitForResponse();
    wrapper.update();
    expect(wrapper.find(FormErrorMessages).find(FormHelperText)).toHaveLength(0);
    expect(Auth.getToken()).toEqual(ApiMock.API_TOKEN);
    // TODO: redirect after registered
  });

  it('register failed', async () => {
    const wrapper = mount(
      <LoginRegisterPage />,
      options.get(),
    );
    wrapper.find(Tab).filter({ value: 'register' }).simulate('click');
    wrapper.update();
    Test.fill(wrapper.find('input#name'), ApiMock.NAME);
    Test.fill(wrapper.find('input#email'), 'exist@foodie-connector.delivery');
    Test.fill(wrapper.find('input#password'), 'short');
    Test.fill(wrapper.find('input#confirmPassword'), 'wrong');
    wrapper.find('form').simulate('submit');
    wrapper.update();
    Test.assertInputError(
      wrapper.find(InputTextField).filter({ name: 'confirmPassword' }),
      'The passwords do not match.',
    );

    Test.fill(wrapper.find('input#confirmPassword'), 'short');
    wrapper.find('form').simulate('submit');
    await ApiMock.waitForResponse();
    wrapper.update();
    Test.assertInputError(
      wrapper.find(InputTextField).filter({ name: 'email' }),
      'The email has already been taken.',
    );
    Test.assertInputError(
      wrapper.find(InputTextField).filter({ name: 'password' }),
      'The password must have at least 6 characters and contains numbers and letters.',
    );
  });
});
