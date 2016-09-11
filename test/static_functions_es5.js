const One = goog.defineClass(null, {
  constructor() {
  },

  statics: {
    /**
     * Description one.
     * @param {string} foo
     * @param {string} bar
     */
    one: function(foo, bar) {
      return foo + '-' + bar;
    },

    /**
     * Description two.
     * @typedef {{name: string, age: number}}
     */
    two: {},

    three: function() {

    }
  }
});
