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
}

export default Test;
