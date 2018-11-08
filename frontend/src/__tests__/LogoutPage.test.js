import LogoutPage from 'components/pages/auth/LogoutPage';
import Test from 'facades/Test';
import ApiMock from '__mocks__/api/ApiMock';
import Auth from 'facades/Auth';

describe('<LogoutPage />', () => {
  it('logout succeed', () => {
    Auth.authenticateUser(ApiMock.API_TOKEN, ApiMock.EMAIL);
    const { routerContext } = Test.mountElement(LogoutPage, '/logout?from=%2Ffrom');
    expect(Auth.getToken()).toEqual(null);
    expect(routerContext.getLocation().pathname).toEqual('/login');
    expect(routerContext.getLocation().search).toEqual('?from=%2Ffrom');
  });
});
