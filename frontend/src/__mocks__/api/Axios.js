import axios from 'axios';
import ApiMock from './ApiMock';

class Axios {
  instance;

  constructor(config) {
    this.instance = axios.create(config);
  }

  static initialize() {
    ApiMock.setup(axios);
  }

  static create(config) {
    return new Axios(config);
  }

  get(url, config) {
    return ApiMock.handleRequest(this.instance.get(url, config));
  }

  post(url, data, config) {
    return ApiMock.handleRequest(this.instance.post(url, data, config));
  }

  put(url, data, config) {
    return ApiMock.handleRequest(this.instance.put(url, data, config));
  }

  delete(url, data, config) {
    return ApiMock.handleRequest(this.instance.delete(url, data, config));
  }
}

export default Axios;
