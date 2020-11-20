"use strict";

require("core-js/modules/es.string.replace");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodelastAssignedVariable = getNodelastAssignedVariable;
exports.getASTUntil = getASTUntil;
exports.getFirstLoopNodeArrayWrittenTo = getFirstLoopNodeArrayWrittenTo;
exports.getParent = getParent;
exports.getUpdateNodesInLoop = getUpdateNodesInLoop;
exports.removeNodeFromAST = removeNodeFromAST;
exports.replaceNodeFromAST = replaceNodeFromAST;
exports.nodeUsesIdentifier = nodeUsesIdentifier;

var _estreeWalker = _interopRequireDefault(require("estree-walker"));

var _nodeType = require("../node_types/nodeType.js");

var _memberExpression = require("../node_types/memberExpression.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var walk = _estreeWalker.walk;

function getNodelastAssignedVariable(ast, name, untilNode) {
  let lastNode;
  let doneSearching = false;
  walk(ast, {
    enter: function enter(node, parent, prop, index) {
      if (nodeEquals(node, untilNode)) {
        doneSearching = true;
      }

      if (!doneSearching) {
        switch (node.type) {
          case _nodeType.NodeType.VariableDeclaration:
            for (const declaration of node.declarations) {
              if (declaration.id.name === name) {
                lastNode = declaration;
              }
            }

            break;

          case _nodeType.NodeType.AssignmentExpression:
            if (node.left.name === name) {
              lastNode = node;
            }

            break;

          case _nodeType.NodeType.UpdateExpression:
            if (node.argument.name === name) {
              lastNode = node;
            }

            break;

          case _nodeType.NodeType.SequenceExpression:
            console.error("sequence expression in init node at astTraversal.js not implemented yet");
            throw Error();
            break;
        }
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });
  return lastNode;
}

function getASTUntil(ast, untilNode) {
  let remove = false;
  walk(ast, {
    enter: function enter(node, parent, prop, index) {
      if (node.start !== undefined && node.end !== undefined && node.start === untilNode.start && node.end === untilNode.end) {
        remove = true;
      }
    },
    leave: function leave(node, parent, prop, index) {
      if (remove) {
        this.remove();
      }
    }
  });
  return ast;
}

function getFirstLoopNodeArrayWrittenTo(ast, arrayName, variableName) {
  let assignmentNode;
  let done = false;
  walk(ast, {
    enter: function enter(node, parent, prop, index) {
      if (!done) {
        switch (node.type) {
          case _nodeType.NodeType.ForStatement:
          case _nodeType.NodeType.WhileStatement:
          case _nodeType.NodeType.DoWhileStatement:
            let result = walkAndFindFirstLoopNode(node, arrayName, variableName);

            if (result) {
              assignmentNode = result;
              done = true;
            }

            this.skip();
            break;
        }
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });
  return assignmentNode;
}

function walkAndFindFirstLoopNode(loopNode, arrayName, variableName) {
  let resultNode;
  let done = false;
  walk(loopNode.body, {
    enter: function enter(node, parent, prop, index) {
      if (!done) {
        switch (node.type) {
          case _nodeType.NodeType.ForStatement:
          case _nodeType.NodeType.WhileStatement:
          case _nodeType.NodeType.DoWhileStatement:
            let result = walkAndFindFirstLoopNode(node, arrayName, variableName);

            if (result) {
              resultNode = result;
              done = true;
            }

            this.skip();
            break;

          default:
            if (parent && parent.type === _nodeType.NodeType.AssignmentExpression && node.type === _nodeType.NodeType.MemberExpression) {
              let objectProperty = (0, _memberExpression.solveNamesMemberExpression)(node);

              if (objectProperty[0] === arrayName && objectProperty[1] === variableName) {
                resultNode = loopNode;
                done = true;
              }
            }

            break;
        }
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });
  return resultNode;
}

function getParent(ast, childNode) {
  let parentNode;
  let found = false;
  walk(ast, {
    enter: function enter(node, parent, prop, index) {
      if (!found && nodeEquals(node, childNode)) {
        parentNode = parent;
        found = true;
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });
  return parentNode;
}

function getUpdateNodesInLoop(loopNode, name) {
  let nodes = [];
  walk(loopNode, {
    enter: function enter(node, parent, prop, index) {
      switch (node.type) {
        case _nodeType.NodeType.UpdateExpression:
          if (node.argument.name === name) {
            if (parent && parent.type && parent.type === _nodeType.NodeType.ExpressionStatement) {
              nodes[nodes.length] = parent;
            } else {
              nodes[nodes.length] = node;
            }
          }

          break;

        case _nodeType.NodeType.AssignmentExpression:
          if (node.left.name === name && node.operator.length > 1) {
            if (parent && parent.type && parent.type === _nodeType.NodeType.ExpressionStatement) {
              nodes[nodes.length] = parent;
            } else {
              nodes[nodes.length] = node;
            }
          }

          break;
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });
  return nodes;
}

function removeNodeFromAST(ast, removeNode) {
  walk(ast, {
    enter: function enter(node, parent, prop, index) {
      if (nodeEquals(node, removeNode)) {
        this.remove();
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });
  return ast;
}

function replaceNodeFromAST(ast, nodeToReplace, replaceNode) {
  walk(ast, {
    enter: function enter(node, parent, prop, index) {
      if (nodeEquals(node, nodeToReplace)) {
        this.replace(replaceNode);
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });
  return ast;
}

function nodeUsesIdentifier(node, name) {
  let uses = false;
  walk(node, {
    enter: function enter(node, parent, prop, index) {
      if (node.name !== undefined && node.name === name) {
        uses = true;
      }
    },
    leave: function leave(node, parent, prop, index) {}
  });
  return uses;
}

function nodeEquals(leftNode, rightNode) {
  return leftNode.start !== undefined && leftNode.end !== undefined && rightNode.start !== undefined && rightNode.end !== undefined && leftNode.type !== undefined && rightNode.type !== undefined && leftNode.start === rightNode.start && leftNode.end === rightNode.end && leftNode.type === rightNode.type;
}