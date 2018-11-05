import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Api from 'facades/Api';

configure({ adapter: new Adapter() });

Api.mocking();
