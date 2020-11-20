"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleForStatement = handleForStatement;

var _lodash = _interopRequireDefault(require("lodash"));

var _loop = require("../common/loop.js");

var _variable = require("../types/variable.js");

var _nodeType = require("./nodeType.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleForStatement(forNode) {
  (0, _variable.increaseScope)();
  (0, _nodeType.processASTNode)(forNode.init);
  let arr;

  if (forNode.body.body && forNode.body.type === _nodeType.NodeType.BlockStatement) {
    arr = _lodash.default.cloneDeep(forNode.body.body);
  } else {
    arr = [_lodash.default.cloneDeep(forNode.body)];
  }

  arr.push(forNode.update);
  (0, _loop.performLoop)(forNode.test, arr);
  (0, _variable.decreaseScope)();
}