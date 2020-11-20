"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.solveMemberExpression = solveMemberExpression;
exports.solveNamesMemberExpression = solveNamesMemberExpression;
exports.digUntilBase = digUntilBase;

var _nodeType = require("./nodeType.js");

var _variable = require("../types/variable.js");

var _unknownVariable = require("../types/unknownVariable.js");

var _notDefinedVariable = require("../types/notDefinedVariable.js");

function solveMemberExpression(memberNode) {
  if (memberNode.object.type === _nodeType.NodeType.MemberExpression) {
    let baseVariable = solveMemberExpression(memberNode.object);
    let propertyVariable = getPropertyVariable(memberNode.property);

    switch (baseVariable[0].type) {
      case _variable.VariableType.notDefined:
        return [new _notDefinedVariable.NotDefinedVariable(), propertyVariable];

      case _variable.VariableType.object:
      case _variable.VariableType.array:
        return [baseVariable[0].get(baseVariable[1]), propertyVariable];

      default:
        return [new _unknownVariable.UnknownVariable(), propertyVariable];
    }
  } else {
    let name;

    switch (memberNode.object.type) {
      case _nodeType.NodeType.ThisExpression:
        name = "this";
        break;

      case _nodeType.NodeType.SuperExpression:
        name = "super";
        break;

      case _nodeType.NodeType.Identifier:
        name = memberNode.object.name;
        break;

      default:
        return [new _unknownVariable.UnknownVariable(), getPropertyVariable(memberNode.property)];
    }

    let objectVariable = (0, _variable.getFromVariables)(name);
    let propertyVariable = getPropertyVariable(memberNode.property);

    switch (objectVariable.type) {
      case _variable.VariableType.object:
        propertyVariable = getPropertyVariable(memberNode.property);
        break;

      case _variable.VariableType.array:
        propertyVariable = getPropertyValue(memberNode.property);
        break;
    }

    return [objectVariable, propertyVariable];
  }
}

function solveNamesMemberExpression(memberNode) {
  let objectVariable = digUntilBase(memberNode);
  let propertyVariable = getPropertyVariable(memberNode.property);
  return [objectVariable, propertyVariable];
}

function digUntilBase(node) {
  if (node.object.type === _nodeType.NodeType.MemberExpression) {
    return digUntilBase(node.object);
  } else {
    return node.object.name;
  }
}

function getPropertyVariable(propertyNode) {
  switch (propertyNode.type) {
    case _nodeType.NodeType.Identifier:
      return propertyNode.name;

    case _nodeType.NodeType.Literal:
      return propertyNode.value;
  }
}

function getPropertyValue(propertyNode) {
  switch (propertyNode.type) {
    case _nodeType.NodeType.Identifier:
      let variable = (0, _variable.getFromVariables)(propertyNode.name);

      if (variable.type === _variable.VariableType.notDefined) {
        return;
      } else {
        return variable.value;
      }

    case _nodeType.NodeType.Literal:
      return propertyNode.value;
  }
}