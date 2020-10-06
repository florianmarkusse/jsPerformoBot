import { createVariable } from '../types/variable.mjs';
import { handleArrayPattern } from './arrayPattern.mjs';
import { NodeType } from './nodeType.mjs';
import { getVariable } from './nodeType.mjs';
import { handleObjectPattern } from './objectPattern.mjs';

export function handleVariableDeclarator(declaratorNode) {

    switch (declaratorNode.id.type) {
        case NodeType.ArrayPattern:
            handleArrayPattern(declaratorNode.id, true);
            break;
        case NodeType.ObjectPattern:
            handleObjectPattern(declaratorNode.id, true);
            break;
        default:
            let variable = getVariable(declaratorNode.init);

            if (declaratorNode.id.name) {
                createVariable(declaratorNode.id.name, variable);
            } else {
                declaratorNode.id.properties.forEach(property => {
                    createVariable(property.key.name, variable);
                });
            }
            break;
    }
}

