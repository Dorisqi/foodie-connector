import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import LoginRegisterPage from 'components/pages/auth/LoginRegisterPage';
import FormErrorMessages from 'components/form/FormErrorMessages';
import Test from 'facades/Test';
import ApiMock from '__mocks__/api/ApiMock';
import Auth from 'facades/Auth';

describe('<LoginRegisterPage />', () => {
  it('login succeed', async () => {
    const { routerContext, wrapper } = Test.mountElement(LoginRegisterPage, '/login');
    wrapper.find(Tab).forEach((tab) => {
      expect(tab.prop('selected')).toEqual(tab.prop('value') === 'login');
    });
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    Test.fill(wrapper.find('input#password'), ApiMock.PASSWORD);
    await Test.submitForm(wrapper);
    expect(Auth.getToken()).toEqual(ApiMock.API_TOKEN);
    expect(routerContext.getLocation().pathname).toEqual('/');
  });

  it('login failed', async () => {
    const { wrapper } = Test.mountElement(LoginRegisterPage, '/login');
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    Test.fill(wrapper.find('input#password'), 'wrong');
    await Test.submitForm(wrapper);
    expect(wrapper.find(FormErrorMessages).find(Typography)).toHaveLength(2);
    expect(Auth.getToken()).toEqual(null);
  });

  it('register succeed', async () => {
    const { routerContext, wrapper } = Test.mountElement(
      LoginRegisterPage,
      '/register?from=/from',
    );
    wrapper.find(Tab).forEach((tab) => {
      expect(tab.prop('selected')).toEqual(tab.prop('value') === 'register');
    });
    Test.fill(wrapper.find('input#name'), ApiMock.NAME);
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    Test.fill(wrapper.find('input#password'), ApiMock.PASSWORD);
    Test.fill(wrapper.find('input#confirmPassword'), ApiMock.PASSWORD);
    await Test.submitForm(wrapper);
    expect(Auth.getToken()).toEqual(ApiMock.API_TOKEN);
    expect(routerContext.getLocation().pathname).toEqual('/from');
  });

  it('register failed', async () => {
    const { wrapper } = Test.mountElement(LoginRegisterPage, '/register');
    Test.fill(wrapper.find('input#name'), ApiMock.NAME);
    Test.fill(wrapper.find('input#email'), 'exist@foodie-connector.delivery');
    Test.fill(wrapper.find('input#password'), 'short');
    Test.fill(wrapper.find('input#confirmPassword'), 'wrong');
    await Test.submitForm(wrapper, false);
    Test.assertInputError(wrapper, 'confirmPassword', 'The passwords do not match.');

    Test.fill(wrapper.find('input#confirmPassword'), 'short');
    await Test.submitForm(wrapper);
    Test.assertInputError(wrapper, 'email', 'The email has already been taken.');
    Test.assertInputError(
      wrapper,
      'password',
      'The password must have at least 6 characters and contains numbers and letters.',
    );
  });
});
