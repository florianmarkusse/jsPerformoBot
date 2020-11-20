"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UndefinedRead = void 0;

var _astTraversal = require("../ast_utilities/astTraversal.js");

var _nodes = require("../ast_utilities/nodes.js");

class UndefinedRead {
  constructor(memberNode) {
    this.memberNode = memberNode;
    this.type = "undefinedRead";
  }

  fix(ast) {
    (0, _astTraversal.replaceNodeFromAST)(ast, this.memberNode, (0, _nodes.createIdentifierNode)('undefined'));
  }

  isEqualTo(undefinedRead) {
    return false;
  }

}

exports.UndefinedRead = UndefinedRead;