"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UndefinedVariable = void 0;

var _variable = require("./variable.js");

class UndefinedVariable {
  constructor() {
    this.type = _variable.VariableType.undefined;
    this.value = undefined;
  }

  get() {
    return new UndefinedVariable();
  }

  getWithNode() {
    return new UndefinedVariable();
  }

}

exports.UndefinedVariable = UndefinedVariable;