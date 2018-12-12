import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAxios from '__mocks__/api/Axios';
import LocalStorage from 'facades/LocalStorage';
import MockLocalStorage from '__mocks__/storage/LocalStorage';
import Axios from 'facades/Axios';

configure({ adapter: new Adapter() });

// Mock API
Axios.inject(MockAxios);

// Mock LocalStorage
LocalStorage.inject(MockLocalStorage);

// eslint-disable-next-line no-console
console.error = (message) => {
  throw new Error(`Console.error(${message})`);
};
// eslint-disable-next-line no-console
console.warn = (message) => {
  throw new Error(`Console.warn(${message})`);
};

process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line no-console
  console.log(`Unhandled Rejection at:\n ${p}\n reason:\n ${reason}`);
});

beforeEach(() => {
  MockLocalStorage.init();
});
