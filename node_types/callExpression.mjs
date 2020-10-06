import { createAssignmentToCallExpression } from '../ast_utilities/nodes.mjs';
import { UnknownVariable } from '../types/unknownVariable.mjs';
import { handleAssignmentExpression } from './assignmentExpression.mjs';

export function handleCallExpression(callNode) {

    if (callNode.arguments) {
        callNode.arguments.forEach(argument => {
            handleAssignmentExpression(
                createAssignmentToCallExpression(argument)
            );
        });
    }

    return new UnknownVariable();
}