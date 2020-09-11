import pkg from 'estree-walker'; 
const {walk} = pkg;

import { NodeType } from '../node_types/nodeType.mjs';
import { solveNamesMemberExpression } from '../node_types/memberExpression.mjs';

export function getNodeLastUsedVariable(ast, name) {

    let lastNode;

    walk( ast, {
        enter: function ( node, parent, prop, index ) {

            if (node.name !== undefined && node.name === name) {
                lastNode = node;
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

            if (node === untilNode) {
                remove = true;
            }

        },
        leave: function ( node, parent, prop, index ) {
            if (remove) {
                this.remove();
            }
        }
    });

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