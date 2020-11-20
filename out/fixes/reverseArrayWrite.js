"use strict";

require("core-js/modules/es.string.includes");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReverseArrayWrite = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _astTraversal = require("../ast_utilities/astTraversal.js");

var _nodes = require("../ast_utilities/nodes.js");

var _nodeType = require("../node_types/nodeType.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ReverseArrayWrite {
  constructor(setMap, name) {
    this.setMap = setMap;
    this.name = name;
  }

  fix(ast) {
    let reverseMap = this.findvariables(this.setMap);
    reverseMap = this.filterReverseMap(reverseMap);

    for (const [key, value] of reverseMap) {
      let loopNode = (0, _astTraversal.getFirstLoopNodeArrayWrittenTo)(ast, this.name, key);
      let updateNodes = (0, _astTraversal.getUpdateNodesInLoop)(loopNode.update, key);

      if (loopNode.body.body) {
        updateNodes.push(...(0, _astTraversal.getUpdateNodesInLoop)(loopNode.body.body, key));
      } // Check if does more than writing to array.


      let updateNodesSet = new Set(updateNodes);
      let filterResult;

      if (loopNode.body.body) {
        filterResult = loopNode.body.body.filter(x => !updateNodesSet.has(x));
      } else {
        filterResult = [];
      }

      let nonUpdateLoopNodes = new Set(filterResult);
      let count = 0;

      for (const nonUpdateLoopNode of nonUpdateLoopNodes) {
        if ((0, _astTraversal.nodeUsesIdentifier)(nonUpdateLoopNode, key)) {
          count++;
        }
      }

      if (count === 1) {
        for (const updateNode of updateNodes) {
          (0, _astTraversal.removeNodeFromAST)(ast, updateNode);
        }

        let finalUsedNode;

        if (loopNode.type === _nodeType.NodeType.ForStatement) {
          finalUsedNode = this.checkInit(loopNode.init, key);
          loopNode.update = (0, _nodes.createUpdateExpressionNode)('++', false, key);
        } else {
          // Add update at final part of loop.
          let newUpdateNode = (0, _nodes.createExpressionStatementNode)((0, _nodes.createUpdateExpressionNode)('++', false, key));

          if (loopNode.body.body) {
            loopNode.body.body.push(newUpdateNode);
          } else {
            console.error("Need to create body.body as an array becuase it only has .body" + "now which is not enough for more than 1 statement");
            throw Error();
          }
        }

        if (finalUsedNode === undefined) {
          // Check everything above loop for final use
          finalUsedNode = (0, _astTraversal.getNodelastAssignedVariable)(ast, key, loopNode);
        } // finalUsedNode -> value[value.length - 1]


        this.fixFinalUsedNode(finalUsedNode, value[value.length - 1], ast, key);
        this.fixTestNode(loopNode, value[0] + 1, key);
      }
    }
  }

  fixTestNode(loopNode, smallerThanValue, name) {
    switch (loopNode.test.type) {
      case _nodeType.NodeType.BinaryExpression:
        loopNode.test = (0, _nodes.createBinaryExpressionNode)(name, smallerThanValue, '<');
        break;

      case _nodeType.NodeType.LogicalExpression:
        let result = this.logicalExpressionTest(loopNode.test, name);

        if (result) {
          loopNode.test = (0, _nodes.createLogicalExpressionNode)((0, _nodes.createBinaryExpressionNode)(name, smallerThanValue, '<'), result, '&&');
        } else {
          loopNode.test = (0, _nodes.createBinaryExpressionNode)(name, smallerThanValue, '<');
        }

    }
  }

  logicalExpressionTest(baseNode, name) {
    let leftResult;
    let rightResult;

    if (baseNode.left.type === _nodeType.NodeType.LogicalExpression) {
      leftResult = this.logicalExpressionTest(baseNode.left, name);
    } else {
      leftResult = this.keepBinaryExpression(baseNode.left, name);
    }

    if (baseNode.right.type === _nodeType.NodeType.LogicalExpression) {
      rightResult = this.logicalExpressionTest(baseNode.right, name);
    } else {
      rightResult = this.keepBinaryExpression(baseNode.right, name);
    }

    if (!leftResult && !rightResult) {
      return false;
    }

    if (!leftResult) {
      return rightResult;
    }

    if (!rightResult) {
      return leftResult;
    }

    return (0, _nodes.createLogicalExpressionNode)(leftResult, rightResult, baseNode.operator);
  }

  keepBinaryExpression(binaryExpressionNode, name) {
    let keep = true;

    if (binaryExpressionNode.operator.includes(">") || binaryExpressionNode.operator.includes("<")) {
      if (binaryExpressionNode.left.name !== undefined && binaryExpressionNode.left.name === name) {
        keep = false;
      }

      if (binaryExpressionNode.right.name !== undefined && binaryExpressionNode.right.name === name) {
        keep = false;
      }
    }

    return keep ? binaryExpressionNode : false;
  }

  fillUpdateNode(forLoop) {
    forLoop.update = undefiend;
  }

  checkInit(initNode, indexName) {
    if (initNode === null) {
      return;
    }

    switch (initNode.type) {
      case _nodeType.NodeType.VariableDeclaration:
        for (const declaration of initNode.declarations) {
          if (declaration.id.name === indexName) {
            return declaration;
          }
        }

        break;

      case _nodeType.NodeType.AssignmentExpression:
        if (initNode.left.name === indexName) {
          return initNode;
        }

        break;

      case _nodeType.NodeType.UpdateExpression:
        if (initNode.argument.name === indexName) {
          return initNode;
        }

        break;

      case _nodeType.NodeType.SequenceExpression:
        console.error("sequence expression in init node at reverseArrayWrite.js not implemented yet");
        throw Error();
        break;
    }
  }

  fixFinalUsedNode(finalUsedNode, setToValue, ast, name) {
    switch (finalUsedNode.type) {
      case _nodeType.NodeType.VariableDeclarator:
        (0, _astTraversal.replaceNodeFromAST)(ast, finalUsedNode, (0, _nodes.createVariableDeclaratorNode)(name, setToValue));
        break;

      case _nodeType.NodeType.AssignmentExpression:
      case _nodeType.NodeType.UpdateExpression:
        (0, _astTraversal.replaceNodeFromAST)(ast, finalUsedNode, (0, _nodes.createAssignmentExpressionNode)(name, setToValue, '='));
        break;

      default:
        console.error("finalUsedNode is not correct node type in fixFinalUsedNode");
        throw Error();
    }
  }

  findvariables(setMap) {
    let indexToLocations = new Map();
    let index;
    let arrayLocations = [];

    for (const [key, value] of setMap.entries()) {
      if (index === undefined) {
        index = value;
      }

      if (index != value) {
        indexToLocations.set(index, arrayLocations);
        index = value;
        arrayLocations = [];
      }

      arrayLocations[arrayLocations.length] = key;
    }

    indexToLocations.set(index, arrayLocations);
    return indexToLocations;
  }

  filterReverseMap(reverseMap) {
    for (const [key, value] of reverseMap.entries()) {
      if (!isNaN(key) || value.length < 2) {
        reverseMap.delete(key);
      }
    }

    return reverseMap;
  }

  isEqualTo(reverseArrayWrite) {
    return this.name === reverseArrayWrite.name && compareMaps(this.setMap, reverseArrayWrite.setMap);
  }

}

exports.ReverseArrayWrite = ReverseArrayWrite;

function compareMaps(map1, map2) {
  var testVal;

  if (map1.size !== map2.size) {
    return false;
  }

  for (var [key, val] of map1) {
    testVal = map2.get(key); // in cases of an undefined value, make sure the key
    // actually exists on the object so there are no false positives

    if (testVal !== val || testVal === undefined && !map2.has(key)) {
      return false;
    }
  }

  return true;
}