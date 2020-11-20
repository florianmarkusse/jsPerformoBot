"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleUpdateExpression = handleUpdateExpression;
exports.transformIncrementDecrementOperators = transformIncrementDecrementOperators;

var _lodash = _interopRequireDefault(require("lodash"));

var _variable = require("../types/variable.js");

var _literalVariable = require("../types/literalVariable.js");

var _objectVariable = require("../types/objectVariable.js");

var _arrayVariable = require("../types/arrayVariable.js");

var _unknownVariable = require("../types/unknownVariable.js");

var _assignmentExpression = require("./assignmentExpression.js");

var _binaryExpression = require("./binaryExpression.js");

var _memberExpression = require("./memberExpression.js");

var _undefinedVariable = require("../types/undefinedVariable.js");

var _logicalExpression = require("./logicalExpression.js");

var _unaryExpression = require("./unaryExpression.js");

var _functionDeclaration = require("./functionDeclaration.js");

var _callExpression = require("./callExpression.js");

var _conditionalExpression = require("./conditionalExpression.js");

var _stringEval = require("../common/stringEval.js");

var _nodeType = require("./nodeType.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleUpdateExpression(updateNode) {
  let variable = getReferenceToVariable(updateNode.argument);

  if (variable.type === _variable.VariableType.literal) {
    if (updateNode.prefix) {
      variable.value = (0, _stringEval.postUnaryOperation)(variable.value, transformIncrementDecrementOperators(updateNode.operator));
      return _lodash.default.cloneDeep(variable);
    } else {
      let copy = _lodash.default.cloneDeep(variable);

      variable.value = (0, _stringEval.postUnaryOperation)(variable.value, transformIncrementDecrementOperators(updateNode.operator));
      return copy;
    }
  } else {
    return variable;
  }
}

function transformIncrementDecrementOperators(operator) {
  switch (operator) {
    case '++':
      return "+ 1";

    case '--':
      return "- 1";
  }
}

function getReferenceToVariable(node) {
  if (node === null) {
    return new _undefinedVariable.UndefinedVariable();
  }

  switch (node.type) {
    case _nodeType.NodeType.Literal:
      return new _literalVariable.LiteralVariable(node.value);

    case _nodeType.NodeType.Identifier:
      return (0, _variable.getFromVariables)(node.name);

    case _nodeType.NodeType.ObjectExpression:
      return new _objectVariable.ObjectVariable(node.properties);

    case _nodeType.NodeType.ArrayExpression:
      return new _arrayVariable.ArrayVariable(node.elements);

    case _nodeType.NodeType.BinaryExpression:
      return (0, _binaryExpression.solveBinaryExpressionChain)(node);

    case _nodeType.NodeType.MemberExpression:
      let result = (0, _memberExpression.solveMemberExpression)(node);

      if (typeof result[0].getWithNode === 'function') {
        return result[0].getWithNode(result[1], node);
      }

      return result[0];

    case _nodeType.NodeType.ConditionalExpression:
      return (0, _conditionalExpression.solveConditionalExpression)(node);

    case _nodeType.NodeType.UpdateExpression:
      return handleUpdateExpression(node);

    case _nodeType.NodeType.UnaryExpression:
      return (0, _unaryExpression.handleUnaryExpression)(node);

    case _nodeType.NodeType.CallExpression:
      return (0, _callExpression.handleCallExpression)(node);

    case _nodeType.NodeType.LogicalExpression:
      return (0, _logicalExpression.solveLogicalExpressionChain)(node);

    case _nodeType.NodeType.ThisExpression:
      return (0, _variable.getFromVariables)("this");

    case _nodeType.NodeType.SuperExpression:
      return (0, _variable.getFromVariables)("super");

    case _nodeType.NodeType.FunctionDeclaration:
    case _nodeType.NodeType.FunctionExpression:
    case _nodeType.NodeType.ArrowFunctionExpression:
      return (0, _functionDeclaration.handleFunctionDeclaration)(node);

    case _nodeType.NodeType.AssignmentExpression:
      return (0, _assignmentExpression.handleAssignmentExpression)(node);

    case _nodeType.NodeType.NewExpression:
      return new _unknownVariable.UnknownVariable();

    default:
      console.error("GetVariable with node type not handled");
      throw Error();
  }
}