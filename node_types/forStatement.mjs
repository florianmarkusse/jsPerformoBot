import { VariableType, variablesMap } from '../types/variable.mjs';
import { handleVariableDeclarator } from './variableDeclarator.mjs';
import { handleAssignmentExpression } from './assignmentExpression.mjs';
import { NodeType, processASTNode } from './nodeType.mjs';

export function handleForStatement(forNode) {
    console.log(forNode);
    init(forNode.init);
    processASTNode(forNode.body);

}

function init(initNode) {
    if (initNode === null) {
        return;
    }

    switch(initNode.type) {
        case NodeType.VariableDeclaration:
            initNode.declarations.forEach(declaration => {
                handleVariableDeclarator(declaration.id.name, declaration.init);
            });
            break;
        case NodeType.SequenceExpression:
            initNode.expressions.forEach(expression => {
                handleAssignmentExpression(expression);
            });
            break;
        case NodeType.AssignmentExpression:
            handleAssignmentExpression(initNode);
            break;
    }    
}