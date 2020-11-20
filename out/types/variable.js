"use strict";

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.increaseUnknownLoopNumber = increaseUnknownLoopNumber;
exports.decreaseUnknownLoopNumber = decreaseUnknownLoopNumber;
exports.increaseScope = increaseScope;
exports.decreaseScope = decreaseScope;
exports.getFromVariables = getFromVariables;
exports.createVariable = createVariable;
exports.createVariableAt = createVariableAt;
exports.assignVariable = assignVariable;
exports.inUnknownLoop = inUnknownLoop;
exports.getVariables = getVariables;
exports.clearVariablesMap = clearVariablesMap;
exports.getCopyOrReference = getCopyOrReference;
exports.VariableType = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _updateExpression = require("../node_types/updateExpression.js");

var _NaNVariable = require("./NaNVariable.js");

var _unknownVariable = require("./unknownVariable.js");

var _undefinedVariable = require("./undefinedVariable.js");

var _stringEval = require("../common/stringEval.js");

var _notDefinedVariable = require("./notDefinedVariable.js");

var _nodeType = require("../node_types/nodeType.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const VariableType = Object.freeze({
  'unknown': 'unknown',
  'array': 'array',
  'literal': 'literal',
  'object': 'object',
  'undefined': 'undefined',
  'NaN': 'NaN',
  'notDefined': 'notDefined'
});
exports.VariableType = VariableType;
let variablesMapArray = [new Map()];
let unknownLoopNumber = [];

function increaseUnknownLoopNumber() {
  unknownLoopNumber[unknownLoopNumber.length] = variablesMapArray.length;
}

function decreaseUnknownLoopNumber() {
  unknownLoopNumber.splice(unknownLoopNumber.length - 1, 1);
}

function increaseScope() {
  variablesMapArray[variablesMapArray.length] = new Map();
}

function decreaseScope() {
  variablesMapArray.splice(variablesMapArray.length - 1, 1);
}

function getFromVariables(name) {
  let variable = getVar(name);

  if (variable === undefined) {
    if (typeof name === "undefined" || name === "undefined") {
      return new _undefinedVariable.UndefinedVariable();
    }

    if (name === "NaN") {
      return new _NaNVariable.NaNVariable();
    }

    return new _notDefinedVariable.NotDefinedVariable();
  }

  if (name !== "this" && name !== "super" && inUnknownLoop(name)) {
    assignVariable(name, new _unknownVariable.UnknownVariable());
    return new _unknownVariable.UnknownVariable();
  }

  return variable;
}

function getVar(name) {
  for (let i = variablesMapArray.length - 1; i >= 0; i--) {
    if (variablesMapArray[i].has(name)) {
      return variablesMapArray[i].get(name);
    }
  }

  return;
}

function createVariable(name, variable) {
  variablesMapArray[variablesMapArray.length - 1].set(name, variable);
}

function createVariableAt(name, variable) {
  variablesMapArray[findScopeOf(name)].set(name, variable);
}

function assignVariable(name, variable) {
  let index = findScopeOf(name);

  if (index >= 0) {
    if (inUnknownLoop(name)) {
      variablesMapArray[index].set(name, new _unknownVariable.UnknownVariable());
    } else {
      variablesMapArray[index].set(name, variable);
    }
  } else {
    // Weird javascript stuff, apparently it's sometimes possible to set something to a new value
    // e.g. "Dagoba = {}" without having declared Dagoba first or imported it or whatever...
    createVariable(name, variable); //console.error("wanted to assign '" + name + "' to new value but could not find in variables maps");
    //throw Error();
  }
}

function inUnknownLoop(name) {
  return unknownLoopNumber[unknownLoopNumber.length - 1] > findScopeOf(name);
}

function findScopeOf(name) {
  for (let i = variablesMapArray.length - 1; i >= 0; i--) {
    if (variablesMapArray[i].has(name)) {
      return i;
    }
  }

  return -1;
}

function getVariables() {
  return variablesMapArray;
}

function clearVariablesMap() {
  variablesMapArray = [new Map()];
  unknownLoopNumber = [];
}

function getCopyOrReference(variable) {
  switch (variable.type) {
    case VariableType.literal:
    case VariableType.undefined:
    case VariableType.unknown:
    case VariableType.NaN:
    case VariableType.notDefined:
      return _lodash.default.cloneDeep(variable);

    case VariableType.array:
    case VariableType.object:
      return variable;
  }
}