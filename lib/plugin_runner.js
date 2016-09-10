const fs = require('fs');
const babel = require('babel-core');
const googDefineClass = require('./goog_define_class');

class PluginRunner {
  static run(fileName) {
    const src = fs.readFileSync(fileName, 'utf8');
    const out = babel.transform(src, {
      plugins: [googDefineClass]
    });
    return out.code;
  }
}

module.exports = PluginRunner;
