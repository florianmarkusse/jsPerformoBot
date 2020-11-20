"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleObjectPattern = handleObjectPattern;

var _lodash = _interopRequireDefault(require("lodash"));

var _estreeWalker = _interopRequireDefault(require("estree-walker"));

var _nodes = require("../ast_utilities/nodes.js");

var _assignmentExpression = require("./assignmentExpression.js");

var _variableDeclarator = require("./variableDeclarator.js");

var _nodeType = require("./nodeType.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var walk = _estreeWalker.walk;

// TODO: do actual destructuring
function handleObjectPattern(objectPatternNode, create) {
  objectPatternNode.properties.forEach(property => {
    if (property !== null) {
      walk(property, {
        enter: function enter(node, parent, prop, index) {
          if (node.type === _nodeType.NodeType.Identifier) {
            if (create) {
              (0, _variableDeclarator.handleVariableDeclarator)((0, _nodes.createUnknownVariableDeclaratorNode)(node.name));
            } else {
              (0, _assignmentExpression.handleAssignmentExpression)((0, _nodes.createAssignmentToCallExpression)(_lodash.default.cloneDeep(node)));
            }
          }
        },
        leave: function leave(node, parent, prop, index) {}
      });
    }
  });
}