class Price {
  static display(price) {
    return `$${Number(price).toFixed(2)}`;
  }
}

export default Price;
