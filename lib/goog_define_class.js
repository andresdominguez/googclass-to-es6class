module.exports = function(babel) {

  const t = babel.types;

  function isGoogDefineClass(path) {
    try {
      const callee = path.node.declarations[0].init.callee;
      return callee.object.name === 'goog' &&
          callee.property.name === 'defineClass';
    } catch (e) {
      return false;
    }
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

    const method = t.classMethod(kind, prop.key, prop.value.params, getBody(prop));
    // Copy comments, if any.
    const comments = prop.leadingComments;
    if (comments) {
      method.leadingComments = comments;
    }

    return method
  }

  /**
   * Find the parent class in goog.defineClass(PARENT, {...});
   */
  function findParentClass(declaration) {
    try {
      const argument = declaration.init.arguments[0];
      return t.isNullLiteral(argument) ? null : argument;
    } catch (e) {
      return null;
    }
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
        const superClass = findParentClass(declaration);
        const decorators = [];

        // Need to add a super() class in the body.
        if (superClass !== null) {
          // Find the constructor.
          const constructorMethod = classMethods
              .find(method => method.kind === 'constructor');
          if (constructorMethod) {
            // Add the super(<constructor params>) at the beginning of the fn.
            constructorMethod.body.body.unshift(
                t.ExpressionStatement(
                    t.CallExpression(t.super(), constructorMethod.params)));
          }
        }

        const classDeclaration = t.classDeclaration(className,
            superClass,
            classBody,
            decorators
        );
        path.replaceWith(classDeclaration);

        if (statics) {
          // Static functions go inside the class with the 'static' keyword.
          const staticFunctions = statics
              .filter(objProperty => t.isFunctionExpression(objProperty.value));
          staticFunctions.forEach(fn => {
            const classMethod = t.classMethod(
                'method', fn.key, fn.value.params, fn.value.body, false, true);
            classMethod.leadingComments = fn.leadingComments;
            classBody.body.push(classMethod);
          });

          // Static objects go after the class definition.
          const objectProperties = statics
              .filter(objProperty => t.isObjectExpression(objProperty.value));

          // Reverse the order so when we add the elements they are in the
          // correct order.
          objectProperties.slice(0).reverse().forEach(objProp => {
            let expressionStatement =
                createExpressionStatementForStatics(className, objProp);
            path.insertAfter(expressionStatement);
          });
        }
      }
    }
  };
};
