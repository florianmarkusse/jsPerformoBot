"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NaNVariable = void 0;

var _variable = require("./variable.js");

class NaNVariable {
  constructor() {
    this.type = _variable.VariableType.NaN;
    this.value = NaN;
  }

}

exports.NaNVariable = NaNVariable;