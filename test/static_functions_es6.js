class One {
  constructor() {}

  /**
   * Description one.
   * @param {string} foo
   * @param {string} bar
   */
  static one(foo, bar) {
    return foo + '-' + bar;
  }

  static three() {}

}

/**
 * Description two.
 * @typedef {{name: string, age: number}}
 */
One.two = {};
