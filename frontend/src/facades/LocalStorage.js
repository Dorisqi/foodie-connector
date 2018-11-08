class LocalStorage {
  static instance = null;

  static initialize(instance) {
    if (this.instance !== null) {
      return;
    }
    this.instance = instance;
  }

  static getItem(key) {
    return this.instance.getItem(key);
  }

  static setItem(key, value) {
    this.instance.setItem(key, value);
  }

  static removeItem(key) {
    this.instance.removeItem(key);
  }
}

export default LocalStorage;
