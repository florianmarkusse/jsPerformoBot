import { getVariable } from './nodeType.mjs';


export function handleUpdateExpression(updateNode) {
    let variable = getVariable(updateNode.argument);

    if (updateNode.prefix) {
        
    } else {

    }

    if (variable.value === undefined) {
        return 
    }
}