import lodash from 'lodash';

import { NodeType } from './nodeType.mjs';
import { ArrayVariable } from '../types/arrayVariable.mjs';
import { LiteralVariable } from '../types/literalVariable.mjs';
import { ObjectVariable } from '../types/objectVariable.mjs';
import { UnknownVariable } from '../types/unknownVariable.mjs';
import { solveBinaryExpressionChain } from './binaryExpression.mjs';
import { solveConditionalExpression } from './conditionalExpression.mjs';
import { UndefinedVariable } from '../types/undefinedVariable.mjs';
import { variablesMap } from '../types/variable.mjs';
import { VariableType } from '../types/variable.mjs';
import { solveMemberExpression } from './memberExpression.mjs';

export function handleVariableDeclarator(name, initNode) {
    if (initNode != null) {
        switch (initNode.type) {
            case NodeType.MemberExpression: {
                let variable;
                let result = solveMemberExpression(initNode);
                switch (result[0].type) {
                    case VariableType.object:
                        variable = result[0].propertiesMap.get(result[1]);
                        break;
                    case VariableType.array:
                        variable = result[0].getElement(parseInt(result[1]));
                        break;
                }
                variablesMap.set(name, getCopyOrReference(variable));
                return;
            }
            case NodeType.Identifier:
                variablesMap.set(name, getCopyOrReference(variablesMap.get(initNode.name)));
                return;
            case NodeType.Literal:
                variablesMap.set(name, new LiteralVariable(initNode.value));
                return;
            case NodeType.ArrayExpression:
                variablesMap.set(name, new ArrayVariable(initNode.elements)); 
                return;
            case NodeType.ObjectExpression:
                variablesMap.set(name, new ObjectVariable(initNode.properties));
                return;
            case NodeType.BinaryExpression:
                let result = solveBinaryExpressionChain(initNode);
                if (result === undefined) {
                    variablesMap.set(name, new UnknownVariable());
                    return;
                } else {
                    variablesMap.set(name, new LiteralVariable(result));
                    return;
                }
                
            case NodeType.ConditionalExpression:
                let newNode = solveConditionalExpression(initNode);

                if (newNode === undefined) {
                    variablesMap.set(name, new UnknownVariable());
                    return;
                } else {
                    switch (newNode.type) {
                        case NodeType.Literal:
                            variablesMap.set(name, new LiteralVariable(newNode.value));
                            return;
                        case NodeType.ArrayExpression:
                            variablesMap.set(name, new ArrayVariable(newNode.elements));
                            return;
                        case NodeType.ObjectExpression:
                            variablesMap.set(name, new ObjectVariable(newNode.properties));
                            return;
                    }
                }
                break;
            default:
                variablesMap.set(name, new UnknownVariable());
                return;
        } 
    } else {
        variablesMap.set(name, new UndefinedVariable());
        return;
    } 
}

export function getCopyOrReference(variable) {
    switch (variable.type) {
        case VariableType.literal:
        case VariableType.undefined:
        case VariableType.unknown:
            return lodash.cloneDeep(variable);
        case VariableType.array:
        case VariableType.object:
            return variable;
    }
}