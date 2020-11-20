"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnknownVariable = void 0;

var _variable = require("./variable.js");

class UnknownVariable {
  constructor() {
    this.type = _variable.VariableType.unknown;
  }

  getWithNode() {
    return new UnknownVariable();
  }

  get() {
    return new UnknownVariable();
  }

}

exports.UnknownVariable = UnknownVariable;