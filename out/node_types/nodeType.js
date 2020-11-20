"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVariable = getVariable;
exports.processASTNode = processASTNode;
exports.processSingleASTNode = processSingleASTNode;
exports.NodeType = void 0;

var _estreeWalker = _interopRequireDefault(require("estree-walker"));

var _variable = require("../types/variable.js");

var _literalVariable = require("../types/literalVariable.js");

var _objectVariable = require("../types/objectVariable.js");

var _arrayVariable = require("../types/arrayVariable.js");

var _unknownVariable = require("../types/unknownVariable.js");

var _variableDeclarator = require("./variableDeclarator.js");

var _assignmentExpression = require("./assignmentExpression.js");

var _forStatement = require("./forStatement.js");

var _updateExpression = require("./updateExpression.js");

var _binaryExpression = require("./binaryExpression.js");

var _memberExpression = require("./memberExpression.js");

var _whileStatement = require("./whileStatement.js");

var _doWhileStatement = require("./doWhileStatement.js");

var _undefinedVariable = require("../types/undefinedVariable.js");

var _logicalExpression = require("./logicalExpression.js");

var _blockStatement = require("./blockStatement.js");

var _unaryExpression = require("./unaryExpression.js");

var _ifStatement = require("./ifStatement.js");

var _switchStatement = require("./switchStatement.js");

var _tryStatement = require("./tryStatement.js");

var _importDeclaration = require("./importDeclaration.js");

var _functionDeclaration = require("./functionDeclaration.js");

var _classDeclaration = require("./classDeclaration.js");

var _callExpression = require("./callExpression.js");

var _conditionalExpression = require("./conditionalExpression.js");

var _arrayPattern = require("./arrayPattern.js");

var _forInStatement = require("./forInStatement.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var walk = _estreeWalker.walk;

const NodeType = Object.freeze({
  'ArrayExpression': 'ArrayExpression',
  'AssignmentExpression': 'AssignmentExpression',
  'VariableDeclarator': 'VariableDeclarator',
  'Literal': 'Literal',
  'Identifier': 'Identifier',
  'ObjectExpression': 'ObjectExpression',
  'CallExpression': 'CallExpression',
  'BinaryExpression': 'BinaryExpression',
  'ConditionalExpression': 'ConditionalExpression',
  'MemberExpression': 'MemberExpression',
  'ForStatement': 'ForStatement',
  'VariableDeclaration': 'VariableDeclaration',
  'SequenceExpression': 'SequenceExpression',
  'UpdateExpression': 'UpdateExpression',
  'WhileStatement': 'WhileStatement',
  'DoWhileStatement': 'DoWhileStatement',
  'BlockStatement': 'BlockStatement',
  'CallExpression': 'CallExpression',
  'LogicalExpression': 'LogicalExpression',
  'ExpressionStatement': 'ExpressionStatement',
  'UnaryExpression': 'UnaryExpression',
  'IfStatement': 'IfStatement',
  'SwitchStatement': 'SwitchStatement',
  'BreakStatement': 'BreakStatement',
  'TryStatement': 'TryStatement',
  "ImportDeclaration": "ImportDeclaration",
  'FunctionDeclaration': 'FunctionDeclaration',
  'ClassDeclaration': 'ClassDeclaration',
  'ThisExpression': 'ThisExpression',
  'SuperExpression': 'SuperExpression',
  'FunctionExpression': 'FunctionExpression',
  'ArrayPattern': 'ArrayPattern',
  'ObjectPattern': 'ObjectPattern',
  'ArrowFunctionExpression': 'ArrowFunctionExpression',
  'NewExpression': 'NewExpression',
  'TemplateLiteral': 'TemplateLiteral',
  'Program': 'Program',
  'ForInStatement': 'ForInStatement',
  'ForOfStatement': 'ForOfStatement',
  'SpreadElement': 'SpreadElement',
  'AwaitExpression': 'AwaitExpression',
  'ClassExpression': 'ClassExpression',
  'TaggedTemplateExpression': 'TaggedTemplateExpression',
  'MethodDefinition': 'MethodDefinition',
  'YieldExpression': 'YieldExpression',
  'ChainExpression': 'ChainExpression',
  'ImportExpression': 'ImportExpression',
  'MetaProperty': 'MetaProperty',
  'Property': 'Property'
});
exports.NodeType = NodeType;

function getVariable(rightNode) {
  if (rightNode === null) {
    return new _undefinedVariable.UndefinedVariable();
  }

  switch (rightNode.type) {
    case NodeType.Literal:
      return new _literalVariable.LiteralVariable(rightNode.value);

    case NodeType.Identifier:
      return (0, _variable.getCopyOrReference)((0, _variable.getFromVariables)(rightNode.name));

    case NodeType.ObjectExpression:
      return new _objectVariable.ObjectVariable(rightNode.properties);

    case NodeType.ArrayExpression:
      return new _arrayVariable.ArrayVariable(rightNode.elements);

    case NodeType.BinaryExpression:
      return (0, _binaryExpression.solveBinaryExpressionChain)(rightNode);

    case NodeType.MemberExpression:
      let result = (0, _memberExpression.solveMemberExpression)(rightNode);

      if (typeof result[0].getWithNode === 'function') {
        return (0, _variable.getCopyOrReference)(result[0].getWithNode(result[1], rightNode));
      }

      return (0, _variable.getCopyOrReference)(result[0]);

    case NodeType.ConditionalExpression:
      return (0, _conditionalExpression.solveConditionalExpression)(rightNode);

    case NodeType.UpdateExpression:
      return (0, _variable.getCopyOrReference)((0, _updateExpression.handleUpdateExpression)(rightNode));

    case NodeType.UnaryExpression:
      return (0, _unaryExpression.handleUnaryExpression)(rightNode);

    case NodeType.CallExpression:
      return (0, _callExpression.handleCallExpression)(rightNode);

    case NodeType.LogicalExpression:
      return (0, _logicalExpression.solveLogicalExpressionChain)(rightNode);

    case NodeType.ThisExpression:
      return (0, _variable.getCopyOrReference)((0, _variable.getFromVariables)("this"));

    case NodeType.SuperExpression:
      return (0, _variable.getCopyOrReference)((0, _variable.getFromVariables)("super"));

    case NodeType.FunctionDeclaration:
    case NodeType.FunctionExpression:
    case NodeType.ArrowFunctionExpression:
      return (0, _functionDeclaration.handleFunctionDeclaration)(rightNode);

    case NodeType.AssignmentExpression:
      return (0, _assignmentExpression.handleAssignmentExpression)(rightNode);

    case NodeType.SequenceExpression:
      rightNode.expressions.forEach(expression => {
        processASTNode(expression);
      });
      return new _unknownVariable.UnknownVariable();

    case NodeType.ClassExpression:
    case NodeType.TaggedTemplateExpression:
    case NodeType.YieldExpression:
      processASTNode(rightNode);
      return new _unknownVariable.UnknownVariable();

    case NodeType.TemplateLiteral:
    case NodeType.NewExpression:
    case NodeType.SpreadElement:
    case NodeType.AwaitExpression:
    case NodeType.ChainExpression:
    case NodeType.ImportExpression:
    case NodeType.MetaProperty:
      return new _unknownVariable.UnknownVariable();

    default:
      console.error("GetVariable with node type not handled");
      console.log(rightNode);
      throw Error();
  }
}

function processASTNode(ast) {
  walk(ast, {
    enter: function enter(node, parent, prop, index) {
      /*
      let currentDate = new Date();
      console.log(currentDate - startDate);
      */
      switch (node.type) {
        // New variable(s) declared.
        case NodeType.VariableDeclaration:
          node.declarations.forEach(declaration => {
            (0, _variableDeclarator.handleVariableDeclarator)(declaration);
          });
          this.skip();
          break;
        // New variable declared.

        case NodeType.VariableDeclarator:
          (0, _variableDeclarator.handleVariableDeclarator)(node.id.name, node.init);
          this.skip();
          break;
        // Variable assigned new value.

        case NodeType.AssignmentExpression:
          (0, _assignmentExpression.handleAssignmentExpression)(node);
          this.skip();
          break;
        // For statement.

        case NodeType.ForStatement:
          (0, _forStatement.handleForStatement)(node);
          this.skip();
          break;
        // For in/of statement.

        case NodeType.ForInStatement:
        case NodeType.ForOfStatement:
          (0, _forInStatement.handleForInStatement)(node);
          this.skip();
          break;
        // While statement.

        case NodeType.WhileStatement:
          (0, _whileStatement.handleWhileStatement)(node);
          this.skip();
          break;
        // Do while statement.

        case NodeType.DoWhileStatement:
          (0, _doWhileStatement.handleDoWhileStatement)(node);
          this.skip();
          break;
        // Sequence of expressions.

        case NodeType.SequenceExpression:
          node.expressions.forEach(expression => {
            processASTNode(expression);
          });
          this.skip();
          break;
        // Variable is updated.

        case NodeType.UpdateExpression:
          (0, _updateExpression.handleUpdateExpression)(node);
          this.skip();
          break;
        // Block statement.

        case NodeType.BlockStatement:
          (0, _blockStatement.handleBlockStatement)(node);
          this.skip();
          break;
        // Unary statement.

        case NodeType.UnaryExpression:
          (0, _unaryExpression.handleUnaryExpression)(node);
          this.skip();
          break;
        // If statement.

        case NodeType.IfStatement:
          (0, _ifStatement.handleIfStatement)(node);
          this.skip();
          break;
        // Switch statement.

        case NodeType.SwitchStatement:
          (0, _switchStatement.handleSwitchStatement)(node);
          this.skip();
          break;
        // Try-statement.

        case NodeType.TryStatement:
          (0, _tryStatement.handleTryStatement)(node);
          this.skip();
          break;
        // Module import.

        case NodeType.ImportDeclaration:
          (0, _importDeclaration.handleImportDeclaration)(node);
          this.skip();
          break;
        // Function declaration.

        case NodeType.FunctionDeclaration:
          (0, _functionDeclaration.handleFunctionDeclaration)(node);
          this.skip();
          break;
        // Function expression.

        case NodeType.FunctionExpression:
          (0, _functionDeclaration.handleFunctionDeclaration)(node);
          this.skip();
          break;
        // Arrow Function expression:

        case NodeType.ArrowFunctionExpression:
          (0, _functionDeclaration.handleFunctionDeclaration)(node);
          this.skip();
          break;
        // Class declaration.

        case NodeType.ClassDeclaration:
          (0, _classDeclaration.handleClassDeclaration)(node);
          this.skip();
          break;
        // Call expression.

        case NodeType.CallExpression:
          (0, _callExpression.handleCallExpression)(node);
          this.skip();
          break;
        // Array pattern.

        case NodeType.ArrayPattern:
          (0, _arrayPattern.handleArrayPattern)(node);
          this.skip();
          break;
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });
}

function processSingleASTNode(node) {
  if (node === null) {
    return new _unknownVariable.UnknownVariable();
  }

  switch (node.type) {
    case NodeType.LogicalExpression:
      return (0, _logicalExpression.solveLogicalExpressionChain)(node);

    case NodeType.BinaryExpression:
      return (0, _binaryExpression.solveBinaryExpressionChain)(node);

    case NodeType.Literal:
    case NodeType.Identifier:
    case NodeType.UpdateExpression:
      return getVariable(node);

    case NodeType.AssignmentExpression:
      return (0, _assignmentExpression.handleAssignmentExpression)(node);

    case NodeType.UnaryExpression:
      return (0, _unaryExpression.handleUnaryExpression)(node);

    case NodeType.CallExpression:
      return (0, _callExpression.handleCallExpression)(node);

    case NodeType.SequenceExpression:
      node.expressions.forEach(expression => {
        processASTNode(expression);
      });
      return new _unknownVariable.UnknownVariable();

    case NodeType.MemberExpression:
      let result = (0, _memberExpression.solveMemberExpression)(node);

      if (typeof result[0].get === 'function') {
        return (0, _variable.getCopyOrReference)(result[0].get(result[1]));
      }

      return (0, _variable.getCopyOrReference)(result[0]);

    default:
      console.error("process SIngle AST node unknown node type");
      console.error(node);
      throw Error();
  }
}