import React from 'react';
import { mount } from 'enzyme';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import RouterContext from '__mocks__/router-context/RouterContext';
import LoginRegisterPage from 'components/pages/auth/LoginRegisterPage';
import InputTextField from 'components/form/InputTextField';
import FormErrorMessages from 'components/form/FormErrorMessages';
import Test from 'facades/Test';
import ApiMock from '__mocks__/api/ApiMock';
import Auth from 'facades/Auth';

describe('<LoginRegisterPage />', () => {
  const mountElement = (routerContext, url = '/login') => {
    routerContext.getHistory().replace(url);
    const props = routerContext.props();
    return mount(
      <LoginRegisterPage location={props.location} history={props.history} />,
      routerContext.get(),
    );
  };

  it('switch tabs', () => {
    const routerContext = new RouterContext();
    const wrapper = mountElement(routerContext);
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
    const routerContext = new RouterContext();
    const wrapper = mountElement(routerContext);
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    Test.fill(wrapper.find('input#password'), ApiMock.PASSWORD);
    wrapper.find('form').simulate('submit');
    await ApiMock.waitForResponse();
    wrapper.update();
    expect(Auth.getToken()).toEqual(ApiMock.API_TOKEN);
    expect(routerContext.getLocation().pathname).toEqual('/');
  });

  it('login failed', async () => {
    const routerContext = new RouterContext();
    const wrapper = mountElement(routerContext);
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    Test.fill(wrapper.find('input#password'), 'wrong');
    wrapper.find('form').simulate('submit');
    await ApiMock.waitForResponse();
    wrapper.update();
    expect(wrapper.find(FormErrorMessages).find(Typography)).toHaveLength(2);
    expect(Auth.getToken()).toEqual(null);
  });

  it('register succeed', async () => {
    const routerContext = new RouterContext();
    const wrapper = mountElement(routerContext, '/login?from=/from');
    wrapper.find(Tab).filter({ value: 'register' }).simulate('click');
    wrapper.update();
    Test.fill(wrapper.find('input#name'), ApiMock.NAME);
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    Test.fill(wrapper.find('input#password'), ApiMock.PASSWORD);
    Test.fill(wrapper.find('input#confirmPassword'), ApiMock.PASSWORD);
    wrapper.find('form').simulate('submit');
    await ApiMock.waitForResponse();
    wrapper.update();
    expect(Auth.getToken()).toEqual(ApiMock.API_TOKEN);
    expect(routerContext.getLocation().pathname).toEqual('/from');
  });

  it('register failed', async () => {
    const routerContext = new RouterContext();
    const wrapper = mountElement(routerContext);
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
