"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleWhileStatement = handleWhileStatement;

var _lodash = _interopRequireDefault(require("lodash"));

var _loop = require("../common/loop.js");

var _variable = require("../types/variable.js");

var _nodeType = require("./nodeType.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleWhileStatement(whileNode) {
  (0, _variable.increaseScope)();
  let arr;

  if (whileNode.body.body && whileNode.body.body.type === _nodeType.NodeType.BlockStatement) {
    arr = _lodash.default.cloneDeep(whileNode.body.body);
  } else {
    arr = [_lodash.default.cloneDeep(whileNode.body)];
  }

  (0, _loop.performLoop)(whileNode.test, arr);
  (0, _variable.decreaseScope)();
}