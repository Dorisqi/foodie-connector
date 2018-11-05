class LocalStorage {
  static storage = {};

  static init() {
    this.storage = {};
  }

  static getItem(key) {
    const value = this.storage[key];
    if (value === undefined) {
      return null;
    }
    return value;
  }

  static setItem(key, value) {
    this.storage[key] = value;
  }

  static removeItem(key) {
    delete this.storage[key];
  }
}

export default LocalStorage;
