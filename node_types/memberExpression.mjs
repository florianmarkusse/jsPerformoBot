import { NodeType } from './nodeType.mjs'; 
import { VariableType, getFromVariables } from '../types/variable.mjs';


export function solveMemberExpression(memberNode) {

    if (memberNode.object.type === NodeType.MemberExpression) {

        let baseVariable = solveMemberExpression(memberNode.object);
        let propertyVariable = getPropertyVariable(memberNode.property);
        
        return [baseVariable[0].get(baseVariable[1]), propertyVariable];
    } else {
        let objectVariable = getFromVariables(memberNode.object.name);

        let propertyVariable;
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
            if (variable.type === VariableType.unknown) {
                return;
            } else {
                return variable.value;
            }
        case NodeType.Literal:
            return propertyNode.value;
    }
}