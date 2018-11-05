import MockAdapter from 'axios-mock-adapter';
import MockData from './mock-data';

class ApiMock {
  static NAME = 'Test User';

  static EMAIL = 'user@foodie-connector.delivery';

  static PASSWORD = 'test123456';

  static API_TOKEN = 'ZGVlNDI2YTU5MWVkYTExNTRiMWFhNTdiN2U4NDE0NTVjZDdlYmM1Y2RhZjRhNGU5ODA0NDQxNDkxMWJhNzcxMTE=';

  static requesting = false;

  static requestFinishedCallback = null;

  static setup(axios) {
    const mock = new MockAdapter(axios);

    mock.onAny().reply((config) => {
      const requests = MockData[`/api/v1${config.url}`][config.method.toUpperCase()];
      let response = null;
      requests.forEach((request) => {
        if (response !== null) {
          return;
        }
        let matched = true;
        if (request.header !== null) {
          Object.entries(request.header).forEach(([key, value]) => {
            if (config.headers[key] !== value) {
              matched = false;
            }
          });
        }
        if (matched && request.requesting !== null) {
          const requestData = JSON.parse(config.data);
          if (Object.keys(request.request).length !== Object.keys(requestData).length) {
            matched = false;
          } else {
            Object.entries(request.request).forEach(([key, value]) => {
              if (requestData[key] !== value) {
                matched = false;
              }
            });
          }
        }
        if (matched) {
          let responseHeader = null;
          if (request.response_header !== null) {
            responseHeader = {};
            Object.entries(request.response_header).forEach(([key, value]) => {
              responseHeader[key.toLowerCase()] = value;
            });
          }
          response = [
            request.status_code,
            request.response,
            responseHeader,
          ];
        }
      });
      return response === null ? [404] : response;
    });
  }

  static handleRequest(promise) {
    this.requestStarted();
    return new Promise((resolve, reject) => {
      promise.then((res) => {
        resolve(res);
      }).catch((err) => {
        reject(err);
      }).then(() => {
        this.requestFinished();
      });
    });
  }

  static requestStarted() {
    this.requesting = true;
  }

  static requestFinished() {
    this.requesting = false;
    if (this.requestFinishedCallback !== null) {
      this.requestFinishedCallback();
    }
  }

  static waitForResponse() {
    return new Promise((resolve) => {
      if (!this.requesting) {
        resolve();
        return;
      }
      const timeout = setTimeout(() => {
        ApiMock.requestFinishedCallback = null;
        resolve();
      }, 1000);
      this.requestFinishedCallback = () => {
        clearTimeout(timeout);
        resolve();
      };
    });
  }
}

export default ApiMock;
