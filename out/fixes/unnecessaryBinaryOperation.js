"use strict";

require("core-js/modules/es.regexp.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnnecessaryBinaryOperation = void 0;

var _astTraversal = require("../ast_utilities/astTraversal.js");

var _nodes = require("../ast_utilities/nodes.js");

var _nodeType = require("../node_types/nodeType.js");

var _variable = require("../types/variable.js");

const BinaryResult = Object.freeze({
  'keepLeft': 'keepLeft',
  'keepRight': 'keepRight',
  'NaN': 'NaN',
  'zero': 'zero',
  'toString': 'toString',
  'undefined': 'undefined',
  'false': 'false'
});

class UnnecessaryBinaryOperation {
  constructor(leftUnnecessary, rightUnnecessary, nodeToChange, result) {
    this.leftUnnecessary = leftUnnecessary;
    this.rightUnnecessary = rightUnnecessary;
    this.nodeToChange = nodeToChange;
    this.result = result;

    switch (result.type) {
      case _variable.VariableType.NaN:
        this.newNode = BinaryResult.NaN;
        break;

      case _variable.VariableType.literal:
        if (isNaN(result.value)) {
          this.newNode = BinaryResult.toString;
        } else {
          switch (nodeToChange.operator) {
            case '|':
              if (leftUnnecessary && rightUnnecessary) {
                this.newNode = BinaryResult.zero;
              } else if (leftUnnecessary) {
                this.newNode = BinaryResult.keepRight;
              } else if (rightUnnecessary) {
                this.newNode = BinaryResult.keepLeft;
              }

              break;

            case '&':
              this.newNode = BinaryResult.zero;
              break;

            case '>':
              this.newNode = BinaryResult.false;

            case '||':
            case '&&':
              if (leftUnnecessary) {
                this.newNode = BinaryResult.keepRight;
              } else {
                this.newNode = BinaryResult.keepLeft;
              }

              break;

            case '<<':
              if (leftUnnecessary) {
                this.newNode = BinaryResult.zero;
              } else {
                this.newNode = BinaryResult.keepLeft;
              }

              break;

            default:
              console.error("Wanting to change a node due to binary operation with undefined with different operator");
              console.error(nodeToChange.operator);
              throw Error();
          }
        }

        break;

      case _variable.VariableType.undefined:
        this.newNode = BinaryResult.undefined;

      case _variable.VariableType.unknown:
      case _variable.VariableType.notDefined:
        if (leftUnnecessary) {
          this.newNode = BinaryResult.keepRight;
        } else {
          this.newNode = BinaryResult.keepLeft;
        }

    }
  }

  fix(ast) {
    let parentNode = (0, _astTraversal.getParent)(ast, this.nodeToChange);
    let keyToChange = this.getKeyToChange(parentNode);

    switch (this.newNode) {
      case BinaryResult.keepLeft:
        parentNode[keyToChange] = this.nodeToChange.left;
        break;

      case BinaryResult.keepRight:
        parentNode[keyToChange] = this.nodeToChange.right;
        break;

      case BinaryResult.NaN:
        parentNode[keyToChange] = (0, _nodes.createIdentifierNode)(NaN);
        break;

      case BinaryResult.zero:
        parentNode[keyToChange] = (0, _nodes.createLiteralNode)(0);
        break;

      case BinaryResult.toString:
        parentNode[keyToChange] = (0, _nodes.createLiteralNode)(this.result.value);
        break;

      case BinaryResult.undefined:
        parentNode[keyToChange] = (0, _nodes.createIdentifierNode)(undefined);
        break;

      case BinaryResult.false:
        parentNode[keyToChange] = (0, _nodes.createLiteralNode)(false);
    }
  }

  getKeyToChange(parentNode) {
    switch (parentNode.type) {
      case _nodeType.NodeType.VariableDeclarator:
        return "init";

      case _nodeType.NodeType.AssignmentExpression:
        return "right";

      case _nodeType.NodeType.BinaryExpression:
      case _nodeType.NodeType.LogicalExpression:
        if (parentNode.left === this.nodeToChange) {
          return "left";
        } else {
          return "right";
        }

      case _nodeType.NodeType.UnaryExpression:
        return "argument";

      case _nodeType.NodeType.Property:
        return "value";

      default:
        console.error("Wanting to change a node due to binary operation with undefined with alien parent node type");
        console.error(parentNode);
        throw Error();
    }
  }

  isEqualTo(unnexessaryBinaryOperation) {
    return false;
  }

}

exports.UnnecessaryBinaryOperation = UnnecessaryBinaryOperation;