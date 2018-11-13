class Stripe {
  static stripeKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

  static callbacks = [];

  static stripe = null;

  static loaded = false;

  static load() {
    const script = document.createElement('script');
    script.onload = this.onLoad;
    script.src = 'https://js.stripe.com/v3/';
    document.body.appendChild(script);
  }

  static onLoad() {
    Stripe.stripe = window.Stripe(Stripe.stripeKey);
    Stripe.callbacks.forEach((callback) => {
      callback(Stripe.stripe);
    });
  }

  static exec(callback) {
    if (Stripe.stripe === null) {
      Stripe.callbacks.push(callback);
    }
    callback(Stripe.stripe);
  }
}

export default Stripe;
