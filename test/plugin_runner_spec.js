const expect = require('chai').expect;
const fs = require('fs');
const path = require('path');
const pluginRunner = require('../lib/plugin_runner');

describe('goog.defineClass to ES6 class', () => {

  const convert = function(fileName) {
    const testFilePath = path.join(__dirname, fileName);
    // Add new line at the end to match the expected file.
    return pluginRunner.run(testFilePath);
  };

  const readFile = function(fileName) {
    return fs.readFileSync(path.join(__dirname, fileName), 'utf8');
  };

  it('converts file to es6', () => {
    expect(convert('with_statics_es5.js')).to.equal(
        readFile('with_statics_es6.js'));
  });

  it('converts file with parent', () => {
    expect(convert('inheritance_es5.js')).to.equal(
        readFile('inheritance_es6.js'));
  });

  it('converts statics', function() {
    expect(convert('static_functions_es5.js')).to.equal(
        readFile('static_functions_es6.js'));
  });

  it('skips file without goog.defineClass', function() {
    // A file without goog.defineClass will be skipped.
    expect(convert('without_goog_define_class.js')).to.equal(
        readFile('without_goog_define_class.js'));
  });
});
