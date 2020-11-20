import lodash from 'lodash';
import pkg from 'estree-walker'; 
const {walk} = pkg;

import { createUnknownVariableDeclaratorNode } from "../ast_utilities/nodes.mjs";
import { createAssignmentToCallExpression } from "../ast_utilities/nodes.mjs";
import { handleAssignmentExpression } from "./assignmentExpression.mjs";
import { handleVariableDeclarator } from "./variableDeclarator.mjs";
import { NodeType } from "./nodeType.mjs";

// TODO: do actual destructuring
export function handleArrayPattern(arrayPatternNode, create) {

    arrayPatternNode.elements.forEach(element => {
        if (element !== null) {
            walk( element, {
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