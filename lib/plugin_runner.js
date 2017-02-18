const fs = require('fs');
const babel = require('babel-core');
const googDefineClass = require('./goog_define_class');

class PluginRunner {
  static run(fileName) {
    let src = fs.readFileSync(fileName, 'utf8');
    // Skip files without goog.defineClass.
    if (src.indexOf('goog.defineClass') === -1) {
      return src;
    }

    src = escapeClosureTypeCasts(src);

    const out = babel.transform(src, {
      plugins: [googDefineClass]
    });

    // Add an empty line if the original ends with empty line and the
    // transformed doesn't.
    let code = out.code;

    code = restoreClosureTypeCasts(code);

    if (src.endsWith('\n') && !code.endsWith('\n')) {
      return code + '\n';
    }

    return code;
  }
}

const CAST_PREFIX = 'GOOGCLASS_TO_ES6CLASS_CLOSURE_TYPE_CAST';

// Searches for: /** @type...*/
const COMMENT_RE = '\\/\\*\\*\\s*@type([^*]|\\*[^/])+\\*\\/';

/**
 * Babel strips (unnecessary in their opinion) parentheses from Closure
 * type cast expressions. We must escape them to avoid stripping.
 */
function escapeClosureTypeCasts(src) {
  // Find phrases like: /** @type {x} */ (foo)
  const castRe = new RegExp(`(${COMMENT_RE}\\s*)\\(`, 'g');
  return src.replace(castRe, CAST_PREFIX + '($1');
}

/**
 * Restore Closure type casts escaped by escapeClosureTypeCasts.
 */
function restoreClosureTypeCasts(src) {
  // Find all the escaped type casts.
  const castRe = new RegExp(`${CAST_PREFIX}\\((\\s*)(${COMMENT_RE})`, 'g');
  return src.replace(castRe, '$2$1(');
}

module.exports = PluginRunner;
