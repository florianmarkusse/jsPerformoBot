import { createUnknownVariableDeclaratorNode } from '../ast_utilities/nodes.mjs';
import { createAssignmentToCallExpression } from '../ast_utilities/nodes.mjs';
import { UnknownVariable } from '../types/unknownVariable.mjs';
import { VariableType } from '../types/variable.mjs';
import { getFromVariables } from '../types/variable.mjs';
import { handleAssignmentExpression } from './assignmentExpression.mjs';
import { processASTNode } from './nodeType.mjs';
import { NodeType } from './nodeType.mjs';
import { handleVariableDeclarator } from './variableDeclarator.mjs';

export function handleCallExpression(callNode) {

    if (callNode.arguments) {
        callNode.arguments.forEach(argument => {
            if (argument.tpye === NodeType.Identifier) {
                if (getFromVariables(argument.name).type === VariableType.notDefined) {
                    handleVariableDeclarator(createUnknownVariableDeclaratorNode(argument.name));
                } else {
                    handleAssignmentExpression(
                        createAssignmentToCallExpression(argument)
                    );
                }
            } else {
                processASTNode(argument);
            }
        });
    }

    processASTNode(callNode.callee);

    return new UnknownVariable();
}