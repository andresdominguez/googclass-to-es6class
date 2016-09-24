const fs = require('fs');
const babel = require('babel-core');
const googDefineClass = require('./goog_define_class');

class PluginRunner {
  static run(fileName) {
    const src = fs.readFileSync(fileName, 'utf8');
    // Skip files without goog.defineClass.
    if (src.indexOf('goog.defineClass') === -1) {
      return src;
    }

    const out = babel.transform(src, {
      plugins: [googDefineClass]
    });

    // Add an empty line if the original ends with empty line and the
    // transformed doesn't.
    const code = out.code;
    if (src.endsWith('\n') && !code.endsWith('\n')) {
      return code + '\n';
    }

    return code;
  }
}

module.exports = PluginRunner;
