"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleCallExpression = handleCallExpression;

var _nodes = require("../ast_utilities/nodes.js");

var _unknownVariable = require("../types/unknownVariable.js");

var _variable = require("../types/variable.js");

var _assignmentExpression = require("./assignmentExpression.js");

var _nodeType = require("./nodeType.js");

var _variableDeclarator = require("./variableDeclarator.js");

function handleCallExpression(callNode) {
  if (callNode.arguments) {
    callNode.arguments.forEach(argument => {
      if (argument.type === _nodeType.NodeType.Identifier) {
        if ((0, _variable.getFromVariables)(argument.name).type === _variable.VariableType.notDefined) {
          (0, _variableDeclarator.handleVariableDeclarator)((0, _nodes.createUnknownVariableDeclaratorNode)(argument.name));
        } else {
          (0, _assignmentExpression.handleAssignmentExpression)((0, _nodes.createAssignmentToCallExpression)(argument));
        }
      } else {
        (0, _nodeType.processASTNode)(argument);
      }
    });
  }

  (0, _nodeType.processASTNode)(callNode.callee);

  if (callNode.callee && callNode.callee.object) {
    if (callNode.callee.object.name) {
      (0, _variableDeclarator.handleVariableDeclarator)((0, _nodes.createUnknownVariableDeclaratorNode)(callNode.callee.object.name));
    }
  }

  return new _unknownVariable.UnknownVariable();
}