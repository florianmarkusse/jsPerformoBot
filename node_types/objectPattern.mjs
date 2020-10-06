import { createUnknownVariableDeclaratorNode } from "../ast_utilities/nodes.mjs";
import { createAssignmentToCallExpression } from "../ast_utilities/nodes.mjs";
import { handleAssignmentExpression } from "./assignmentExpression.mjs";
import { handleVariableDeclarator } from "./variableDeclarator.mjs";

// TODO: do actual destructuring
export function handleObjectPattern(objectPatternNode, create) {

    objectPatternNode.properties.forEach(property => {
        if (property !== null) {
            if (create) {
                handleVariableDeclarator(createUnknownVariableDeclaratorNode(property.key.name));
            } else {
                handleAssignmentExpression(createAssignmentToCallExpression(property.key)); 
            }
        }
    });
}