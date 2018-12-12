import React from 'react';
import { mount } from 'enzyme';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import FormErrorMessages from 'components/form/FormErrorMessages';
import InputTextField from 'components/form/InputTextField';
import RouterContext from '__mocks__/router-context/RouterContext';
import ApiMock from '__mocks__/api/ApiMock';

class Test {
  static fill(wrapper, value) {
    wrapper.simulate(
      'change',
      {
        target: {
          value,
        },
      },
    );
  }

  static assertInputError(wrapper, name, errorMessage) {
    const helperText = wrapper.find(InputTextField)
      .filter({ name })
      .find(FormHelperText);
    expect(helperText).toHaveLength(1);
    expect(helperText.prop('children')).toEqual(errorMessage);
  }

  static assertFormError(wrapper, length) {
    expect(wrapper.find(FormErrorMessages).find(Typography)).toHaveLength(length);
  }

  static mountElement(Component, url) {
    const routerContext = new RouterContext();
    routerContext.getHistory().replace(url);
    const wrapper = mount(
      <Component
        location={routerContext.getLocation()}
        history={routerContext.getHistory()}
      />,
      routerContext.get(),
    );
    return { routerContext, wrapper };
  }

  static async submitForm(wrapper, waitForApi = true) {
    wrapper.find('form').simulate('submit');
    if (waitForApi) {
      await ApiMock.waitForResponse();
    }
    wrapper.update();
  }
}

export default Test;
