"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LiteralVariable = void 0;

var _variable = require("./variable.js");

class LiteralVariable {
  constructor(value) {
    this.value = value;
    this.type = _variable.VariableType.literal;
  }

  assignValue(value) {
    this.value = value;
  }

}

exports.LiteralVariable = LiteralVariable;