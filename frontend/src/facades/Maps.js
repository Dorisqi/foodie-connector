class Maps {
  static loading = null;

  static apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  static maps = null;

  static callbacks = [];

  static load(callback) {
    if (this.maps !== null) {
      callback();
      return;
    }
    Maps.callbacks.push(callback);
    if (Maps.loading) {
      return;
    }
    this.loading = true;
    window.mapLoaded = () => {
      Maps.maps = window.google.maps;
      Maps.callbacks.forEach((callbackFunc) => {
        callbackFunc();
      });
    };
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places&callback=mapLoaded`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }
}

export default Maps;
