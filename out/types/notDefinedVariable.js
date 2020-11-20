"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotDefinedVariable = void 0;

var _variable = require("./variable.js");

class NotDefinedVariable {
  constructor() {
    this.type = _variable.VariableType.notDefined;
  }

}

exports.NotDefinedVariable = NotDefinedVariable;