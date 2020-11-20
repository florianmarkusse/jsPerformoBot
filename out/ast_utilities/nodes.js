"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLiteralNode = createLiteralNode;
exports.createIdentifierNode = createIdentifierNode;
exports.createAssignmentExpressionNode = createAssignmentExpressionNode;
exports.createAssignmentToCallExpression = createAssignmentToCallExpression;
exports.createVariableDeclaratorNode = createVariableDeclaratorNode;
exports.createUpdateExpressionNode = createUpdateExpressionNode;
exports.createBinaryExpressionNode = createBinaryExpressionNode;
exports.createLogicalExpressionNode = createLogicalExpressionNode;
exports.createExpressionStatementNode = createExpressionStatementNode;
exports.createCorrectNodeBasedOnValue = createCorrectNodeBasedOnValue;
exports.createCallExpressionNode = createCallExpressionNode;
exports.createUnknownVariableDeclaratorNode = createUnknownVariableDeclaratorNode;

var _nodeType = require("../node_types/nodeType.js");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createLiteralNode(value) {
  return {
    type: _nodeType.NodeType.Literal,
    start: 0,
    end: 0,
    value: value,
    raw: String(value)
  };
}

function createIdentifierNode(name) {
  return {
    type: _nodeType.NodeType.Identifier,
    start: 0,
    end: 0,
    name: name
  };
}

function createAssignmentExpressionNode(name, value, op) {
  return {
    type: _nodeType.NodeType.AssignmentExpression,
    start: 0,
    end: 0,
    operator: op,
    left: createIdentifierNode(name),
    right: createLiteralNode(value)
  };
}

function createAssignmentToCallExpression(leftNode) {
  return {
    type: _nodeType.NodeType.AssignmentExpression,
    start: 0,
    end: 0,
    operator: "=",
    left: _lodash.default.cloneDeep(leftNode),
    right: createCallExpressionNode()
  };
}

function createVariableDeclaratorNode(name, value) {
  return {
    type: _nodeType.NodeType.VariableDeclarator,
    start: 0,
    end: 0,
    id: createIdentifierNode(name),
    init: createLiteralNode(value)
  };
}

function createUpdateExpressionNode(op, pref, name) {
  return {
    type: _nodeType.NodeType.UpdateExpression,
    start: 0,
    end: 0,
    operator: op,
    prefix: pref,
    argument: createIdentifierNode(name)
  };
}

function createBinaryExpressionNode(name, value, op) {
  return {
    type: _nodeType.NodeType.BinaryExpression,
    start: 0,
    end: 0,
    left: createIdentifierNode(name),
    operator: op,
    right: createLiteralNode(value)
  };
}

function createLogicalExpressionNode(leftNode, rightNode, op) {
  return {
    type: _nodeType.NodeType.LogicalExpression,
    start: 0,
    end: 0,
    left: leftNode,
    operator: op,
    right: rightNode
  };
}

function createExpressionStatementNode(expressionNode) {
  return {
    type: _nodeType.NodeType.ExpressionStatement,
    start: 0,
    end: 0,
    expression: expressionNode
  };
}

function createCorrectNodeBasedOnValue(value) {
  if (value === undefined || isNaN(value)) {
    return createIdentifierNode(value);
  } else {
    return createLiteralNode(value);
  }
}

function createCallExpressionNode() {
  return {
    type: _nodeType.NodeType.CallExpression,
    start: 0,
    end: 0,
    callee: null,
    arguments: [],
    optional: false
  };
}

function createUnknownVariableDeclaratorNode(name) {
  return {
    type: _nodeType.NodeType.VariableDeclarator,
    start: 0,
    end: 0,
    id: createIdentifierNode(name),
    init: createCallExpressionNode()
  };
}