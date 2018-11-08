import FakeLocalStorage from '__mocks__/storage/LocalStorage';

class LocalStorage {
  static isMocking = false;

  static getInstance() {
    return this.isMocking ? FakeLocalStorage : localStorage;
  }

  static getItem(key) {
    return this.getInstance().getItem(key);
  }

  static setItem(key, value) {
    this.getInstance().setItem(key, value);
  }

  static removeItem(key) {
    this.getInstance().removeItem(key);
  }

  static mocking() {
    this.isMocking = true;
    FakeLocalStorage.init();
  }
}

export default LocalStorage;
