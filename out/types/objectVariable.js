"use strict";

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectVariable = void 0;

var _variable = require("./variable.js");

var _nodeType = require("../node_types/nodeType.js");

var _undefinedVariable = require("../types/undefinedVariable.js");

var _fix = require("../fixes/fix.js");

var _undefinedRead = require("../fixes/undefinedRead.js");

var _unknownVariable = require("../types/unknownVariable.js");

var _astTraversal = require("../ast_utilities/astTraversal.js");

var _app = require("../app.js");

let reservedKeyWords = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', '__defineGetter__', '__definedSetter__', '__lookupGetter__', '__lookupSetter__', '__proto__', 'construnctor'];

class ObjectVariable {
  constructor(properties, isThis) {
    this.type = _variable.VariableType.object;
    this.value = {};
    this.propertiesMap = new Map();
    this.known = true;
    properties.forEach(property => {
      this.addProperty(property);
    });

    if (isThis) {
      this.propertiesMap.set("constructor", new _unknownVariable.UnknownVariable());
    }
  }

  addProperty(property) {
    let key;

    if (property.key) {
      if (property.key.type === _nodeType.NodeType.Identifier) {
        key = property.key.name;
      } else {
        key = property.key.value;
      }

      let value = (0, _nodeType.getVariable)(property.value);
      this.propertiesMap.set(key, value);
    } else {
      this.known = false;
    }
  }

  get(name) {
    if (this.propertiesMap.has(name)) {
      return this.propertiesMap.get(name);
    } else {
      return new _unknownVariable.UnknownVariable();
    }
  }

  getWithNode(name, node) {
    if (this.propertiesMap.has(name)) {
      return this.propertiesMap.get(name);
    } else {
      let constructorOrProgram = getOuterLoop(node);

      if ((0, _variable.getFromVariables)(name).type === _variable.VariableType.notDefined && !reservedKeyWords.includes(name) && this.known && constructorOrProgram && constructorOrProgram.type === _nodeType.NodeType.MethodDefinition && constructorOrProgram.kind === "constructor") {
        (0, _fix.addToFixSet)(new _undefinedRead.UndefinedRead(node));
        return new _undefinedVariable.UndefinedVariable();
      }

      return new _unknownVariable.UnknownVariable();
    }
  }

  set(key, value, property, name) {
    if ((0, _variable.inUnknownLoop)(name)) {
      this.propertiesMap.set(key, new _unknownVariable.UnknownVariable());
    } else {
      this.propertiesMap.set(key, value);
    }
  }

  delete(key) {
    if (this.propertiesMap.has(key)) {
      thiis.propertiesMap.delete(key);
    }
  }

}

exports.ObjectVariable = ObjectVariable;

function getOuterLoop(node) {
  if (node && node.type !== _nodeType.NodeType.MethodDefinition && node.type !== _nodeType.NodeType.Program) {
    return getOuterLoop((0, _astTraversal.getParent)((0, _app.getBaseAST)(), node));
  } else {
    return node;
  }
}