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

  function genFromFunctionExpression(kind, prop) {
    return t.classMethod(kind, prop.key, prop.value.params, getBody(prop));
  }

  /**
   * t.classMethod(kind, key, params, body, computed, static)
   * @param prop
   * @return {*}
   */
  function functionExpressionToClassMethod(prop) {
    return anyToClassMethod(prop, genFromFunctionExpression);
  }

  function genFromObjectMethod(kind, prop) {
    return t.classMethod(kind, prop.key, prop.params, prop.body);
  }

  function objectMethodToClassMethod(prop) {
    return anyToClassMethod(prop, genFromObjectMethod);
  }

  function anyToClassMethod(prop, methodGen) {
    const name = prop.key.name;
    const kind = name === 'constructor' ? 'constructor' : 'method';

    const method = methodGen(kind, prop);
    // Copy comments, if any.
    const comments = prop.leadingComments;
    if (comments) {
      method.leadingComments = comments;
    }

    return method;
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

  const constructorRe = /[ \t]*\*[ \t]*@constructor[ \t]*\n/;

  /**
   * Remove the " * @constructor" line from the last comment
   * before the constructor.
   */
  function removeConstructorComment(constructor) {
    if (!constructor) return;
    const lastComment =
      constructor.leadingComments &&
      constructor.leadingComments[constructor.leadingComments.length - 1];
    if (!lastComment) return;
    const oldValue = lastComment.value;
    lastComment.value = oldValue.replace(constructorRe, '');
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
            classMethods.push(functionExpressionToClassMethod(prop));
          } else if (t.isObjectMethod(prop)) {
            classMethods.push(objectMethodToClassMethod(prop));
          } else if (prop.key.name === 'statics') {
            statics = prop.value.properties;
          } else {
            // Prevent silently dropping properties.
            throw new Error('Unrecognised expression type: ', prop.type);
          }
        });

        const classBody = t.ClassBody(classMethods);
        const superClass = findParentClass(declaration);
        const decorators = [];

        const constructorMethod = classMethods
            .find(method => method.kind === 'constructor');
        removeConstructorComment(constructorMethod);

        // Need to add a super() class in the body.
        if (superClass !== null) {
          // Find the constructor.
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
