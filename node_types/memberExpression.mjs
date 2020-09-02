import { NodeType, getValueFromLiteralOrIdentifierNode } from './nodeType.mjs'; 
import { VariableType, variablesMap } from '../types/variable.mjs';
import { getVariableFromLiteralOrIdentifierNode } from './nodeType.mjs';


export function solveMemberExpression(memberNode) {

    if (memberNode.object.type === NodeType.MemberExpression) {

        let propertyVariable = getValueFromLiteralOrIdentifierNode(memberNode.property);
        let baseVariable = solveMemberExpression(memberNode.object);
        
        switch (baseVariable[0].type) {
            case VariableType.object:
                return [baseVariable[0].propertiesMap.get(baseVariable[1]), propertyVariable];
            case VariableType.array:
                return [baseVariable[0].getElement(parseInt(baseVariable[1])), propertyVariable];
        }

    } else {
        let objectVariable = variablesMap.get(memberNode.object.name);

        let propertyVariable;
        if (objectVariable.type === VariableType.object) {
            propertyVariable = memberNode.property.name;
        } else {
            propertyVariable = getVariableFromLiteralOrIdentifierNode(memberNode.property);
        }

        return [objectVariable, propertyVariable,];
    }
}