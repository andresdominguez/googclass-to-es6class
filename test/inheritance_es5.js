const Parent = goog.require('some.ns.MyParent');

/**
 * This is foo bar.
 */
const FooBar = goog.defineClass(Parent, {
  /**
   * Creates a new instance of...
   * @param {Object} name
   */
  constructor: function(name) {
    this.name = name;

    /** @export {string} */
    this.somethingElse = '';
  }
});

exports = FooBar;
