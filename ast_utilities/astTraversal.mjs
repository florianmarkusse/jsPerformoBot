import pkg from 'estree-walker'; 
const {walk} = pkg;

import { NodeType } from '../node_types/nodeType.mjs';
import { solveNamesMemberExpression } from '../node_types/memberExpression.mjs';

export function getNodelastAssignedVariable(ast, name) {

    let lastNode;

    walk( ast, {
        enter: function ( node, parent, prop, index ) {

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
                break;
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
                        walk( node, {
                            enter: function ( withinLoopNode, withinLoopPparent) {
                                if (withinLoopPparent && 
                                    withinLoopPparent.type === NodeType.AssignmentExpression && 
                                    withinLoopNode.type === NodeType.MemberExpression) {
                                    let objectProperty = solveNamesMemberExpression(withinLoopNode);
                                    if (objectProperty[0] === arrayName && objectProperty[1] === variableName) {
                                        assignmentNode = node;
                                        done = true;
                                    }
                                }

                            },
                            leave: function ( node, parent, prop, index ) {
                            }
                        } );
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

export function getParent(ast, childNode) {
    let parentNode;
    let found = false;

    walk( ast, {
        enter: function ( node, parent, prop, index ) {

            if (!found && node === childNode) {
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
                        nodes[nodes.length] = node;
                    }
                    break;
                case NodeType.AssignmentExpression:
                    if (node.left.name === name && node.operator.length > 1) {
                        nodes[nodes.length] = node;
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

            if (node.start !== undefined && node.end !== undefined && node.start === removeNode.start && node.end === removeNode.end) {
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

            if (node.start !== undefined && node.end !== undefined && node.start === nodeToReplace.start && node.end === nodeToReplace.end) {
                this.replace(replaceNode);
            }

        },
        leave: function ( node, parent, prop, index ) {
        }
    });

    return ast;
}