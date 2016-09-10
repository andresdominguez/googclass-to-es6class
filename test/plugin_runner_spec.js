const expect = require('chai').expect;
const path = require('path');
const pluginRunner = require('../lib/plugin_runner');

describe('goog.defineClass to ES6 class', () => {

  it('should convert file to es6', function() {
    const testFilePath = path.join(__dirname, 'simple_example.js');
    console.log('testFilePath', testFilePath);
    const out = pluginRunner.run(testFilePath);

    expect(out).to.equal(`/**
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


exports = FooBar;`);
  });
});
