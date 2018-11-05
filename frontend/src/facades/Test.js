import TextField from '@material-ui/core/TextField';

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

  static assertInputError(wrapper, errorMessage) {
    const textField = wrapper.find(TextField);
    expect(textField.prop('error')).toEqual(true);
    expect(textField.prop('helperText')).toEqual(errorMessage);
  }
}

export default Test;
