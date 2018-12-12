class Snackbar {
  static enqueueFunc = null;

  static inject(func) {
    this.enqueueFunc = func;
  }

  static success(message) {
    this.enqueueFunc(message, {
      variant: 'success',
    });
  }

  static error(message) {
    this.enqueueFunc(message, {
      variant: 'error',
    });
  }

  static warning(message) {
    this.enqueueFunc(message, {
      variant: 'error',
    });
  }
}

export default Snackbar;
