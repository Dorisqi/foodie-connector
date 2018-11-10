import axios from 'axios';
import _ from 'lodash';

class Axios {
  static localAxios = axios;
}

class CancellablePromise {
  constructor(promise, cancelSource) {
    this.promise = promise;
    this.cancelSource = cancelSource;
  }

  then(resolve) {
    this.promise = this.promise.then(resolve);
    return this;
  }

  catch(reject) {
    this.promise = this.promise.catch((err) => {
      if (err.message !== 'Cancelled') {
        reject(err);
      }
    });
    return this;
  }

  cancel() {
    this.cancelSource.cancel('Cancelled');
  }
}

class Instance {
  constructor(instance) {
    this.instance = instance;
    this.defaults = instance.defaults;
  }

  static configWithCancelTolen(config, cancelSource) {
    if (_.isNil(config)) {
      return {
        cancelToken: cancelSource.token,
      };
    }
    return {
      ...config,
      cancelToken: cancelSource.token,
    };
  }

  get(url, config) {
    const cancelSource = Axios.cancelSource();
    return new CancellablePromise(
      this.instance.get(url, Instance.configWithCancelTolen(config, cancelSource)),
      cancelSource,
    );
  }

  post(url, data, config) {
    const cancelSource = Axios.cancelSource();
    return new CancellablePromise(
      this.instance.post(url, data, Instance.configWithCancelTolen(config, cancelSource)),
      cancelSource,
    );
  }

  put(url, data, config) {
    const cancelSource = Axios.cancelSource();
    return new CancellablePromise(
      this.instance.put(url, data, Instance.configWithCancelTolen(config, cancelSource)),
      cancelSource,
    );
  }
}

Axios.create = config => new Instance(Axios.localAxios.create(config));

Axios.cancelSource = () => axios.CancelToken.source();

Axios.cancelRequest = (cancellablePromise) => {
  if (cancellablePromise !== null) {
    cancellablePromise.cancel();
  }
};

Axios.inject = (localAxios) => {
  Axios.localAxios = localAxios;
};

export default Axios;
