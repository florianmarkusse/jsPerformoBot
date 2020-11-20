"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTryStatement = handleTryStatement;

var _lodash = _interopRequireDefault(require("lodash"));

var _nodeType = require("./nodeType.js");

var _variable = require("../types/variable.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function handleTryStatement(tryNode) {
  (0, _variable.increaseUnknownLoopNumber)();
  (0, _nodeType.processASTNode)(tryNode.block);

  if (tryNode.handler !== null) {
    (0, _variable.increaseScope)();
    let arr;

    if (tryNode.handler.body.body) {
      arr = _lodash.default.cloneDeep(tryNode.handler.body.body);
    } else {
      arr = [_lodash.default.cloneDeep(tryNode.handler.body)];
    }

    arr.push(tryNode.handler.param);
    (0, _nodeType.processASTNode)(arr);
    (0, _variable.decreaseScope)();
  }

  (0, _variable.decreaseUnknownLoopNumber)();

  if (tryNode.finalizer !== null) {
    (0, _nodeType.processASTNode)(tryNode.finalizer);
  }
}