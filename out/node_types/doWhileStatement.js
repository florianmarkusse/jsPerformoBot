"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleDoWhileStatement = handleDoWhileStatement;

var _lodash = _interopRequireDefault(require("lodash"));

var _loop = require("../common/loop.js");

var _variable = require("../types/variable.js");

var _nodeType = require("./nodeType.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleDoWhileStatement(doWhileNode) {
  (0, _variable.increaseScope)();
  let arr;

  if (doWhileNode.body.body && doWhileNode.body.body.type === _nodeType.NodeType.BlockStatement) {
    arr = _lodash.default.cloneDeep(doWhileNode.body.body);
  } else {
    arr = [_lodash.default.cloneDeep(doWhileNode.body)];
  }

  if (doWhileNode.body.body && doWhileNode.body.body.type === _nodeType.NodeType.BlockStatement) {
    (0, _nodeType.processASTNode)(doWhileNode.body.body);
  } else {
    (0, _nodeType.processASTNode)(doWhileNode.body);
  }

  (0, _loop.performLoop)(doWhileNode.test, arr);
  (0, _variable.decreaseScope)();
}