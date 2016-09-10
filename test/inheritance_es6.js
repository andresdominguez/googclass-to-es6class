const Parent = goog.require('some.ns.MyParent');

/**
 * This is foo bar.
 */
class FooBar extends Parent {
  /**
   * Creates a new instance of...
   * @param {Object} name
   */
  constructor(name) {
    this.name = name;

    /** @export {string} */
    this.somethingElse = '';
  }

}

exports = FooBar;
