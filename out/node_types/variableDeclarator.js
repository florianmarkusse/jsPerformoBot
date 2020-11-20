"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleVariableDeclarator = handleVariableDeclarator;

var _variable = require("../types/variable.js");

var _arrayPattern = require("./arrayPattern.js");

var _nodeType = require("./nodeType.js");

var _objectPattern = require("./objectPattern.js");

function handleVariableDeclarator(declaratorNode) {
  switch (declaratorNode.id.type) {
    case _nodeType.NodeType.ArrayPattern:
      (0, _arrayPattern.handleArrayPattern)(declaratorNode.id, true);
      break;

    case _nodeType.NodeType.ObjectPattern:
      (0, _objectPattern.handleObjectPattern)(declaratorNode.id, true);
      break;

    default:
      let variable = (0, _nodeType.getVariable)(declaratorNode.init);

      if (declaratorNode.id.name) {
        (0, _variable.createVariable)(declaratorNode.id.name, variable);
      } else {
        if (declaratorNode.id.properties === undefined) {
          console.log("in here");
        }

        declaratorNode.id.properties.forEach(property => {
          (0, _variable.createVariable)(property.key.name, variable);
        });
      }

      break;
  }
}