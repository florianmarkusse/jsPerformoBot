import lodash from 'lodash';
import pkg from 'estree-walker'; 
const {walk} = pkg;

import { createUnknownVariableDeclaratorNode } from "../ast_utilities/nodes.mjs";
import { createAssignmentToCallExpression } from "../ast_utilities/nodes.mjs";
import { handleAssignmentExpression } from "./assignmentExpression.mjs";
import { handleVariableDeclarator } from "./variableDeclarator.mjs";
import { NodeType } from "./nodeType.mjs";



// TODO: do actual destructuring
export function handleObjectPattern(objectPatternNode, create) {

    objectPatternNode.properties.forEach(property => {
        if (property !== null) {
            walk( property, {
                enter: function ( node, parent, prop, index ) {
                    if (node.type === NodeType.Identifier) {
                        if (create) {
                            handleVariableDeclarator(createUnknownVariableDeclaratorNode(node.name))
                        } else {
                            handleAssignmentExpression(createAssignmentToCallExpression(lodash.cloneDeep(node)));
                        }
                    }
                },
                leave: function ( node, parent, prop, index ) {
                }
            });
        }
    });
}