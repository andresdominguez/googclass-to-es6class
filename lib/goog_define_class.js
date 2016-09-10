module.exports = function(babel) {

  var t = babel.types;

  function isGoogDefineClass(path) {
    try {
      const callee = path.node.declarations[0].init.callee;
      return callee.object.name === 'goog' &&
          callee.property.name === 'defineClass';
    } catch (e) {
      return false;
    }
  }

  function getParams(prop) {
    return prop.value.params;
  }

  function getBody(prop) {
    let body = t.blockStatement([]);
    if (prop.value.body) {
      body = prop.value.body;
    }
    return body;
  }

  function createExpressionStatementForStatics(className, objProp) {
    // Generate ClassName.staticName
    let left = t.MemberExpression(className, objProp.key);
    // Assign the key and value defined in the statics.
    const expressionStatement = t.expressionStatement(
        t.assignmentExpression('=', left, objProp.value));
    // Comments?
    if (objProp.leadingComments) {
      expressionStatement.leadingComments = objProp.leadingComments;
    }
    return expressionStatement;
  }

  /**
   * t.classMethod(kind, key, params, body, computed, static)
   * @param prop
   * @return {*}
   */
  function toClassMethod(prop) {

    const name = prop.key.name;
    const kind = name === 'constructor' ? 'constructor' : 'method';

    const method = t.classMethod(kind, prop.key, getParams(prop), getBody(prop));

    // Copy comments, if any.
    const comments = prop.leadingComments;
    if (comments) {
      method.leadingComments = comments;
    }

    return method
  }

  return {
    visitor: {
      VariableDeclaration: function(path) {
        if (path.parentKey !== 'body' || !isGoogDefineClass(path)) {
          return;
        }

        const declaration = path.node.declarations[0];
        const objectExpression = declaration.init.arguments[1];
        const className = t.Identifier(declaration.id.name);

        // Turn all the properties in the goog.defineClass object arg into
        // ClassMethod methods. Filter out statics.
        let statics = null;
        let classMethods = [];
        objectExpression.properties.forEach(prop => {
          if (t.isFunctionExpression(prop.value)) {
            classMethods.push(toClassMethod(prop));
          } else if (prop.key.name === 'statics') {
            statics = prop.value.properties;
          }
        });

        const classBody = t.ClassBody(classMethods);
        const superClass = null;
        const decorators = [];

        const classDeclaration = t.classDeclaration(className,
            superClass,
            classBody,
            decorators
        );
        path.replaceWith(classDeclaration);

        if (statics) {
          // Reverse the order so when we add the elements they are in the
          // correct order.
          statics.slice(0).reverse().forEach(objProp => {
            let expressionStatement =
                createExpressionStatementForStatics(className, objProp);
            path.insertAfter(expressionStatement);
          });
        }
      }
    }
  };
};
