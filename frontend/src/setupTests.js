import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import axios from '__mocks__/api/Axios';
import LocalStorage from 'facades/LocalStorage';
import MockLocalStorage from '__mocks__/storage/LocalStorage';
import Api from 'facades/Api';

configure({ adapter: new Adapter() });

// Mock API
axios.initialize();
Api.initialize(axios);

// Mock LocalStorage
LocalStorage.initialize(MockLocalStorage);

// eslint-disable-next-line no-console
console.error = (message) => {
  throw new Error(message);
};

beforeEach(() => {
  MockLocalStorage.init();
});
