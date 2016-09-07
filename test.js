/**
 * Andres, this is foo bar
 */
const FooBar = goog.defineClass(null, {
  /**
   *
   * @param name
   */
  constructor: function(name) {
    this.name = name;

    /** @export {string} */
    this.somethingElse = '';
  },

  hello: function() {
  },

  /**
   * Test for yo yo.
   * @param foo
   * @param bar
   * @return {string}
   */
  yoyoyo: function(foo, bar) {
    return '';
  },

  statics: {
    /**
     * @typedef {{one: string, two: string}}
     */
    Foo: {
      one: 'on'
    },
    Chooo: {
      two: 'tttwwwoo'
    }
  }
});

exports = FooBar;
