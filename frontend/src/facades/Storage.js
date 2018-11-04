class Storage {
  static url(file) {
    return `https://storage.googleapis.com/${process.env.REACT_APP_CLOUD_STORAGE_BUCKET}/${file}`;
  }
}

export default Storage;
