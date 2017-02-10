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
    super(name);

    this.name = name;

    /** @export {string} */
    this.somethingElse = '';
  }

  /* A comment */
  newStyle(paramOne, paramTwo) {
    console.log('foo');
  }

}

exports = FooBar;
