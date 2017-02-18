const Parent = goog.require('some.ns.MyParent');

/**
 * This is foo bar.
 */
const FooBar = goog.defineClass(Parent, {
  /**
   * Creates a new instance of...
   * @param {Object} name
   * @constructor
   */
  constructor: function(name) {
    this.name = name;

    /** @export {string} */
    this.somethingElse = '';
  },

  /* A comment */
  newStyle(paramOne, paramTwo) {
    console.log('foo');
    const severityName = /** @type {string} */ (fn(scope));
  }

});

exports = FooBar;
