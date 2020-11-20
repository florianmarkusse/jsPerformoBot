"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleImportDeclaration = handleImportDeclaration;

var _nodes = require("../ast_utilities/nodes.js");

var _variableDeclarator = require("./variableDeclarator.js");

function handleImportDeclaration(importNode) {
  importNode.specifiers.forEach(importSpecifier => {
    (0, _variableDeclarator.handleVariableDeclarator)((0, _nodes.createUnknownVariableDeclaratorNode)(importSpecifier.local.name));
  });
}