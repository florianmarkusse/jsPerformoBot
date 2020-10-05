import { createVariable } from '../types/variable.mjs';
import { getVariable } from './nodeType.mjs';

export function handleVariableDeclarator(declaratorNode) {

    let variable = getVariable(declaratorNode.init);

    if (declaratorNode.id.name) {
        createVariable(declaratorNode.id.name, variable);
    } else {
        declaratorNode.id.properties.forEach(property => {
            createVariable(property.key.name, variable);
        });
    }

    
}

