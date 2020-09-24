import { createVariable } from '../types/variable.mjs';
import { getVariable } from './nodeType.mjs';

export function handleVariableDeclarator(name, initNode) {
    let variable = getVariable(initNode);
    createVariable(name, variable);
}

