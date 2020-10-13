import pkg from 'estree-walker'; 
const {walk} = pkg;

import { NodeType } from '../node_types/nodeType.mjs';
import { solveNamesMemberExpression } from '../node_types/memberExpression.mjs';

export function getNodelastAssignedVariable(ast, name, untilNode) {

    let lastNode;
    let doneSearching = false;


    walk( ast, {
        enter: function ( node, parent, prop, index ) {
            if (nodeEquals(node, untilNode)) {
                doneSearching = true;
            }
            if (!doneSearching) {
                switch (node.type) {
                    case NodeType.VariableDeclaration:
                    for (const declaration of node.declarations) {
                        if (declaration.id.name === name) {
                            lastNode = declaration;
                        }
                    }
                    break;
                case NodeType.AssignmentExpression:
                    if (node.left.name === name) {
                        lastNode = node;
                    }
                    break;
                case NodeType.UpdateExpression:
                    if (node.argument.name === name) {
                        lastNode = node;
                    }
                    break;
                case NodeType.SequenceExpression:
                    console.error("sequence expression in init node at astTraversal.mjs not implemented yet");
                    throw Error();
                    break;
                }
            }
        },
        leave: function ( node, parent, prop, index ) {
        }
    });

    return lastNode;
}

export function getASTUntil(ast, untilNode) {

    let remove = false;

    walk( ast, {
        enter: function ( node, parent, prop, index ) {

            if (node.start !== undefined && node.end !== undefined && node.start === untilNode.start && node.end === untilNode.end) {
                remove = true;
            }

        },
        leave: function ( node, parent, prop, index ) {
            if (remove) {
                this.remove();
            }
        }
    });

    return ast;
}

export function getFirstLoopNodeArrayWrittenTo(ast, arrayName, variableName) {

    let assignmentNode;
    let done = false;

    walk( ast, {
        enter: function ( node, parent, prop, index ) {

            if (!done) {
                switch (node.type) {
                    case NodeType.ForStatement:
                    case NodeType.WhileStatement:
                    case NodeType.DoWhileStatement:
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
        leave: function ( node, parent, prop, index ) {
        }
    });

    return assignmentNode;
}

function walkAndFindFirstLoopNode(loopNode, arrayName, variableName) {

    let resultNode;
    let done = false;

    walk( loopNode.body, {
        enter: function ( node, parent, prop, index ) {

            if (!done) {
                switch (node.type) {
                    case NodeType.ForStatement:
                    case NodeType.WhileStatement:
                    case NodeType.DoWhileStatement:
                        let result = walkAndFindFirstLoopNode(node, arrayName, variableName);
                        if (result) {
                            resultNode = result;
                            done = true;
                        }
                        this.skip();
                        break;
                    default:
                        if (parent && parent.type === NodeType.AssignmentExpression && node.type === NodeType.MemberExpression) {
                            let objectProperty = solveNamesMemberExpression(node);
                            if (objectProperty[0] === arrayName && objectProperty[1] === variableName) {
                                resultNode = loopNode;
                                done = true;
                            }
                        }
                        break;
                }
            }
        },
        leave: function ( node, parent, prop, index ) {
        }
    });

    return resultNode;
}

export function getParent(ast, childNode) {
    let parentNode;
    let found = false;

    walk( ast, {
        enter: function ( node, parent, prop, index ) {

            if (!found && nodeEquals(node, childNode)) {
                parentNode = parent;
                found = true;
            }

        },
        leave: function ( node, parent, prop, index ) {
        }
    });

    return parentNode;
}

export function getUpdateNodesInLoop(loopNode, name) {

    let nodes = [];

    walk( loopNode, {
        enter: function ( node, parent, prop, index ) {

            switch (node.type) {
                case NodeType.UpdateExpression:
                    if (node.argument.name === name) {
                        if (parent && parent.type && parent.type === NodeType.ExpressionStatement) {
                            nodes[nodes.length] = parent;
                        } else {
                            nodes[nodes.length] = node;
                        }
                    }
                    break;
                case NodeType.AssignmentExpression:
                    if (node.left.name === name && node.operator.length > 1) {
                        if (parent && parent.type && parent.type === NodeType.ExpressionStatement) {
                            nodes[nodes.length] = parent;
                        } else {
                            nodes[nodes.length] = node;
                        }
                    }
                    break;
            }

        },
        leave: function ( node, parent, prop, index ) {
        }
    });

    return nodes;
}

export function removeNodeFromAST(ast, removeNode) {
    walk( ast, {
        enter: function ( node, parent, prop, index ) {

            if (nodeEquals(node, removeNode)) {
                this.remove();
            }

        },
        leave: function ( node, parent, prop, index ) {
        }
    });

    return ast;
}

export function replaceNodeFromAST(ast, nodeToReplace, replaceNode) {
    walk( ast, {
        enter: function ( node, parent, prop, index ) {

            if (nodeEquals(node, nodeToReplace)) {
                this.replace(replaceNode);
            }

        },
        leave: function ( node, parent, prop, index ) {
        }
    });

    return ast;
}

export function nodeUsesIdentifier(node, name) {

    let uses = false;

    walk( node, {
        enter: function ( node, parent, prop, index ) {

            if (node.name !== undefined && node.name === name) {
                uses = true;
            }

        },
        leave: function ( node, parent, prop, index ) {
        }
    });

    return uses;
}

function nodeEquals(leftNode, rightNode) {
    return  leftNode.start !== undefined && leftNode.end !== undefined && 
            rightNode.start !== undefined && rightNode.end !== undefined &&
            leftNode.type !== undefined && rightNode.type !== undefined &&
            leftNode.start === rightNode.start && leftNode.end === rightNode.end &&
            leftNode.type === rightNode.type
            ;
}