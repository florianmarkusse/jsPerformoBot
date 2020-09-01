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

export function handleVariableDeclarator(initNode) {
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
                return getCopyOrReference(variable);
            }
            case NodeType.Identifier:
                return getCopyOrReference(variablesMap.get(initNode.name));
            case NodeType.Literal:
                return new LiteralVariable(initNode.value);
            case NodeType.ArrayExpression:
                return new ArrayVariable(initNode.elements);
            case NodeType.ObjectExpression:
                return new ObjectVariable(initNode.properties);
            case NodeType.BinaryExpression:
                let result = solveBinaryExpressionChain(initNode);
                if (result === undefined) {
                    return new UnknownVariable();
                } else {
                    return new LiteralVariable(result);
                }
                
            case NodeType.ConditionalExpression:
                let newNode = solveConditionalExpression(initNode);

                if (newNode === undefined) {
                    return new UnknownVariable();
                } else {
                    switch (newNode.type) {
                        case NodeType.Literal:
                            return new LiteralVariable(newNode.value);
                        case NodeType.ArrayExpression:
                            return new ArrayVariable(newNode.elements);
                        case NodeType.ObjectExpression:
                            return new ObjectVariable(newNode.properties);
                    }
                }
                break;
            default:
                return new UnknownVariable();
        } 
    } else {
        return new UndefinedVariable();
    } 
}

function getCopyOrReference(variable) {
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