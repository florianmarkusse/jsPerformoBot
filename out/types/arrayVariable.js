"use strict";

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrayVariable = void 0;

var _variable = require("./variable.js");

var _nodeType = require("../node_types/nodeType.js");

var _reverseArrayWrite = require("../fixes/reverseArrayWrite.js");

var _fix = require("../fixes/fix.js");

var _undefinedVariable = require("../types/undefinedVariable.js");

var _unknownVariable = require("../types/unknownVariable.js");

var _undefinedRead = require("../fixes/undefinedRead.js");

class ArrayVariable {
  constructor(elements) {
    this.elements = [];
    this.isKnown = true;
    elements.forEach(element => {
      this.addElement(element);
    });
    this.setValue(); // Map from variables or constants to which index in the array they set.

    this.setMap = new Map();
    this.reverseFix = undefined;
    this.type = _variable.VariableType.array;
  }

  addElement(elementNode) {
    this.elements[this.elements.length] = (0, _nodeType.getVariable)(elementNode);
    this.setValue();
  }

  setValue() {
    let array = [];

    for (const element of this.elements) {
      if (element !== undefined) {
        array[array.length] = element.value;
      }
    }

    this.value = array;
  }

  get(index) {
    if (!this.isKnown) {
      return new _unknownVariable.UnknownVariable();
    }

    if (typeof index === 'string' || index instanceof String) {
      index = (0, _variable.getFromVariables)(index).value;
    }

    if (!isNaN(index) && this.elements[index]) {
      return this.elements[index];
    } else {
      return new _undefinedVariable.UndefinedVariable();
    }
  }

  getWithNode(index, node) {
    if (!this.isKnown) {
      return new _unknownVariable.UnknownVariable();
    }

    let val;

    if (typeof index === 'string' || index instanceof String) {
      val = (0, _variable.getFromVariables)(index).value;
    } else {
      val = index;
    }

    if (this.elements[val] !== undefined) {
      return this.elements[val];
    } else {
      //if (getFromVariables(val).type === VariableType.undefined && !isNaN(index)) {
      //    addToFixSet(new UndefinedRead(node));
      //    return new UndefinedVariable();
      //}
      return new _unknownVariable.UnknownVariable();
    }
  }

  set(index, element, key, name) {
    if (typeof index === 'string' || index instanceof String) {
      index = (0, _variable.getFromVariables)(index).value;
    }

    if (isNaN(index)) {
      this.isKnown = false;
      this.value = undefined;
    }

    if (this.isKnown) {
      if (this.firstWrite(index) && isNaN(key)) {
        this.setMap.set(index, key);
      }

      if ((0, _variable.inUnknownLoop)(name)) {
        this.elements[index] = new _unknownVariable.UnknownVariable();
      } else {
        this.elements[index] = element;
      }

      this.needsFixing(name);
      this.setValue();
    }
  }

  firstWrite(index) {
    return this.elements[index] === undefined;
  }

  setMapPair(key, index) {
    if (this.firstWrite(index)) {
      this.setMap.set(index, key);
    }
  }

  needsFixing(name) {
    if (this.isReverse(Array.from(this.setMap.keys()))) {
      (0, _fix.deleteFromFixSet)(this.reverseFix);
      this.reverseFix = new _reverseArrayWrite.ReverseArrayWrite(this.setMap, name);
      (0, _fix.addToFixSet)(this.reverseFix);
    }
  }

  isReverse(array) {
    if (array.length <= 1) {
      return false;
    }

    return array.every(function (x, i) {
      return i === 0 || x === array[i - 1] - 1;
    });
  }

}

exports.ArrayVariable = ArrayVariable;