const expect = require('chai').expect;
const path = require('path');
const pluginRunner = require('../lib/plugin_runner');

describe('goog.defineClass to ES6 class', () => {

  const convert = function(fileName) {
    const testFilePath = path.join(__dirname, fileName);
    return pluginRunner.run(testFilePath);
  };

  it('converts file to es6', function() {
    const converted = convert('simple_example.js');

    expect(converted).to.equal(`/**
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
