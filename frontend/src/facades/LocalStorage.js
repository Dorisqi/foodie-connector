class LocalStorage {
  static localStorage = localStorage;

  static inject(localStorage) {
    this.localStorage = localStorage;
  }

  static getItem(key) {
    return this.localStorage.getItem(key);
  }

  static setItem(key, value) {
    this.localStorage.setItem(key, value);
  }

  static removeItem(key) {
    this.localStorage.removeItem(key);
  }
}

export default LocalStorage;
