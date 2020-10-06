import { createUnknownVariableDeclaratorNode } from "../ast_utilities/nodes.mjs";
import { createAssignmentToCallExpression } from "../ast_utilities/nodes.mjs";
import { handleAssignmentExpression } from "./assignmentExpression.mjs";
import { handleVariableDeclarator } from "./variableDeclarator.mjs";

// TODO: do actual destructuring
export function handleArrayPattern(arrayPatternNode, create) {

    arrayPatternNode.elements.forEach(element => {
        if (element !== null) {
            if (create) {
                handleVariableDeclarator(createUnknownVariableDeclaratorNode(element.name));
            } else {
                handleAssignmentExpression(createAssignmentToCallExpression(element)); 
            }
        }
    });
}