/**
 * Andres, this is foo bar
 */
class FooBar {
  /**
   *
   * @param name
   */
  constructor(name) {
    this.name = name;

    /** @export {string} */
    this.somethingElse = '';
  }

  hello() {}

  /**
   * Test for yo yo.
   * @param foo
   * @param bar
   * @return {string}
   */
  yoyoyo(foo, bar) {
    return '';
  }

}

/**
 * @typedef {{one: string, two: string}}
 */
FooBar.Foo = {
  one: 'on'
};
FooBar.Chooo = {
  two: 'tttwwwoo'
};


exports = FooBar;
