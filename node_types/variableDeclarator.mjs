import { setToVariables } from '../types/variable.mjs';
import { getVariable } from './nodeType.mjs';

export function handleVariableDeclarator(name, initNode) {
    let variable = getVariable(initNode);
    setToVariables(name, variable);
}

