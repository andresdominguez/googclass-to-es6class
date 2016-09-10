# googclass-to-es6class

Transform a google closure class defined using goog.defineClass into an es6 class

For example:

```javascript
const Parent = goog.require('some.ns.Parent');

const FooBar = goog.defineClass(Parent, {
  /**
   * Creates a new instance of...
   * @param {Object} name
   */
  constructor: function(name) {
    this.name = name;
  }
});

exports = FooBar;
```

Will be transformed into:

```javascript
const Parent = goog.require('some.ns.Parent');

class FooBar extends Parent {
  /**
   * Creates a new instance of...
   * @param {Object} name
   */
  constructor(name) {
    super(name);

    this.name = name;
  }
}

exports = FooBar;
```

## How to use it

### Install from npm

```shell
npm i goog-class-to-es6 -g
```

### Transform a file

Provide the name of the file. The transformed class will be written to stdout:

```shell
goog-class-to-es6 some_goog_define_class.js
```

## Testing

```shell
# 1. Clone this repo
# 2. Install
npm i
# 3. Test
npm test
```
