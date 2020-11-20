import { getParent } from '../ast_utilities/astTraversal.mjs';
import { createIdentifierNode } from '../ast_utilities/nodes.mjs';
import { createLiteralNode } from '../ast_utilities/nodes.mjs';
import { NodeType } from '../node_types/nodeType.mjs';
import { VariableType } from '../types/variable.mjs';

const BinaryResult = Object.freeze({
    'keepLeft': 'keepLeft',
    'keepRight': 'keepRight', 
    'NaN': 'NaN',
    'zero': 'zero',
    'toString':'toString',
    'undefined':'undefined',
    'false':'false'
});

export class UnnecessaryBinaryOperation {
    constructor(leftUnnecessary, rightUnnecessary, nodeToChange, result) {

        this.leftUnnecessary = leftUnnecessary;
        this.rightUnnecessary = rightUnnecessary;
        this.nodeToChange = nodeToChange;
        this.result = result;

        switch (result.type) {
            case VariableType.NaN:
                this.newNode = BinaryResult.NaN;
                break;
            case VariableType.literal:
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
                            console.error("Wanting to change a node due to binary operation with undefined with different operator")
                            console.error(nodeToChange.operator);
                            throw Error();
                    }
                }
                break;
            case VariableType.undefined:
                this.newNode = BinaryResult.undefined;
            case VariableType.unknown:
            case VariableType.notDefined:
                if (leftUnnecessary) {
                    this.newNode = BinaryResult.keepRight;
                } else {
                    this.newNode = BinaryResult.keepLeft;
                }
        }
    }

    fix(ast) {

        let parentNode = getParent(ast, this.nodeToChange);
        let keyToChange = this.getKeyToChange(parentNode);

        switch (this.newNode) {
            case BinaryResult.keepLeft:
                parentNode[keyToChange] = this.nodeToChange.left;
                break;
            case BinaryResult.keepRight:
                parentNode[keyToChange] = this.nodeToChange.right;
                break;
            case BinaryResult.NaN:
                parentNode[keyToChange] = createIdentifierNode(NaN);
                break;
            case BinaryResult.zero:
                parentNode[keyToChange] = createLiteralNode(0);
                break;
            case BinaryResult.toString:
                parentNode[keyToChange] = createLiteralNode(this.result.value);
                break;
            case BinaryResult.undefined:
                parentNode[keyToChange] = createIdentifierNode(undefined);
                break;
            case BinaryResult.false:
                parentNode[keyToChange] = createLiteralNode(false);
        }
    }

    getKeyToChange(parentNode) {
        switch (parentNode.type) {
            case NodeType.VariableDeclarator:
                return "init";
            case NodeType.AssignmentExpression:
                return "right";
            case NodeType.BinaryExpression:
            case NodeType.LogicalExpression:
                if (parentNode.left === this.nodeToChange) {
                    return "left";
                } else {
                    return "right";
                }
            case NodeType.UnaryExpression:
                return "argument";
            case NodeType.Property:
                return "value";
            default:
                console.error("Wanting to change a node due to binary operation with undefined with alien parent node type")
                console.error(parentNode);
                throw Error();
        }
    }

    isEqualTo(unnexessaryBinaryOperation) {
        return false;
    }
}
