class Format {
  static underline2camel(name) {
    return name.replace(/_[a-z0-9]/g, it => it[1].toUpperCase());
  }
}

export default Format;
