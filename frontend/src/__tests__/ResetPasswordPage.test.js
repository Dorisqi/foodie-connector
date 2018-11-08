import ResetPasswordPage from 'components/pages/auth/ResetPasswordPage';
import ApiMock from '__mocks__/api/ApiMock';
import Test from 'facades/Test';

describe('<ResetPasswordPage />', () => {
  const newPassword = 'new123456';

  it('reset succeed', async () => {
    const { routerContext, wrapper } = Test.mountElement(ResetPasswordPage, '/reset-password?from=%2Ffrom');
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    await Test.submitForm(wrapper);
    Test.assertFormError(wrapper, 0);
    Test.fill(wrapper.find('input#token'), '12345678');
    Test.fill(wrapper.find('input#password'), newPassword);
    Test.fill(wrapper.find('input#confirmPassword'), newPassword);
    await Test.submitForm(wrapper);
    expect(routerContext.getLocation().pathname).toEqual('/login');
    expect(routerContext.getLocation().search).toEqual('?from=%2Ffrom');
  });

  it('reset failed', async () => {
    const { wrapper } = Test.mountElement(ResetPasswordPage, '/reset-password');
    Test.fill(wrapper.find('input#email'), 'throttle@foodie-connector.delivery');
    await Test.submitForm(wrapper);
    Test.assertFormError(wrapper, 2);
    Test.fill(wrapper.find('input#email'), ApiMock.EMAIL);
    await Test.submitForm(wrapper);
    Test.assertFormError(wrapper, 0);
    Test.fill(wrapper.find('input#token'), '87654321');
    Test.fill(wrapper.find('input#password'), newPassword);
    Test.fill(wrapper.find('input#confirmPassword'), 'wrong');
    await Test.submitForm(wrapper, false);
    Test.assertInputError(wrapper, 'confirmPassword', 'The passwords do not match.');
    Test.fill(wrapper.find('input#confirmPassword'), newPassword);
    await Test.submitForm(wrapper);
    Test.assertInputError(wrapper, 'token', 'The token is invalid or expired.');
    Test.fill(wrapper.find('input#email'), 'throttle@foodie-connector.delivery');
    Test.fill(wrapper.find('input#token'), '12345678');
    await Test.submitForm(wrapper);
    Test.assertFormError(wrapper, 2);
  });
});
