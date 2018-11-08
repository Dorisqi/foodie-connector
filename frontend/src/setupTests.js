import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Api from 'facades/Api';
import LocalStorage from 'facades/LocalStorage';

configure({ adapter: new Adapter() });

Api.mocking();

// eslint-disable-next-line no-console
console.error = (message) => {
  throw new Error(message);
};

beforeEach(() => {
  LocalStorage.mocking();
});
