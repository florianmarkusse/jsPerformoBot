import { NodeType } from './nodeType.mjs'; 
import { VariableType, getFromVariables } from '../types/variable.mjs';
import { UnknownVariable } from '../types/unknownVariable.mjs';
import { NotDefinedVariable } from '../types/notDefinedVariable.mjs';


export function solveMemberExpression(memberNode) {

    if (memberNode.object.type === NodeType.MemberExpression) {

        let baseVariable = solveMemberExpression(memberNode.object);
        let propertyVariable = getPropertyVariable(memberNode.property);

        switch (baseVariable[0].type) {
            case VariableType.notDefined:
                return [new NotDefinedVariable(), propertyVariable];
            case VariableType.unknown:
                return [new UnknownVariable(), propertyVariable];
            case VariableType.object:
            case VariableType.array:
                return [baseVariable[0].get(baseVariable[1]), propertyVariable];
        }
    } else {

        let name;

        switch (memberNode.object.type) {
            case NodeType.CallExpression:
                return [new UnknownVariable(), getPropertyVariable(memberNode.property)];
            case NodeType.ThisExpression:
                name = "this";
                break;
            case NodeType.SuperExpression:
                name = "super"
                break;
            case NodeType.Identifier:
                name = memberNode.object.name;
                break;
        }
        let objectVariable = getFromVariables(name);

        let propertyVariable = getPropertyVariable(memberNode.property);
        switch (objectVariable.type) {
            case VariableType.object:
                propertyVariable = getPropertyVariable(memberNode.property);
                break;
            case VariableType.array:
                propertyVariable = getPropertyValue(memberNode.property);
                break;
        }
        return [objectVariable, propertyVariable];
    }
}

export function solveNamesMemberExpression(memberNode) {
    let objectVariable = digUntilBase(memberNode);
    let propertyVariable = getPropertyVariable(memberNode.property);
    return [objectVariable, propertyVariable];
}

export function digUntilBase(node) {
    if (node.object.type === NodeType.MemberExpression) {
        return digUntilBase(node.object);
    } else {
        return node.object.name;
    }
}

function getPropertyVariable(propertyNode) {
    switch (propertyNode.type) {
        case NodeType.Identifier:
            return propertyNode.name;
        case NodeType.Literal:
            return propertyNode.value;
    }
}

function getPropertyValue(propertyNode) {

    switch (propertyNode.type) {
        case NodeType.Identifier:
            let variable = getFromVariables(propertyNode.name);
            if (variable.type === VariableType.notDefined) {
                return;
            } else {
                return variable.value;
            }
        case NodeType.Literal:
            return propertyNode.value;
    }
}