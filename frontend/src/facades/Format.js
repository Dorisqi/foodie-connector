class Format {
  static underline2camel(name) {
    return name.replace(/_[a-z0-9]/g, it => it[1].toUpperCase());
  }

  static formatAddress(address, addressPrefix = false) {
    const line1 = addressPrefix ? address.address_line_1 : address.line_1;
    const line2 = addressPrefix ? address.address_line_2 : address.line_2;
    return `${line1}${line2.length > 0 ? `, ${line2}` : ''}, ${address.city}, ${address.state} ${address.zip_code}`;
  }

  static displayPrice(price) {
    return `$${Number(price).toFixed(2)}`;
  }
}

export default Format;
