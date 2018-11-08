import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from '__mocks__/api/Axios';
import LocalStorage from 'facades/LocalStorage';
import Api from 'facades/Api';

configure({ adapter: new Adapter() });

axios.initialize();
Api.initialize(axios);

// eslint-disable-next-line no-console
console.error = (message) => {
  throw new Error(message);
};

beforeEach(() => {
  LocalStorage.mocking();
});
