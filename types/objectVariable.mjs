import {Variable, VariableType} from './variable.mjs';
import { NodeType, getVariable } from '../node_types/nodeType.mjs';

export class ObjectVariable extends Variable {

    constructor(properties) {
        super();
        this.type = VariableType.object;

        this.propertiesMap = new Map();

        properties.forEach(property => {
            this.addProperty(property);
        });
    }

    addProperty(property) {
        let key;
            if (property.key.type === NodeType.Identifier) {
                key = property.key.name;
            } else {
                key = property.key.value;
            }

            let value = getVariable(property.value);
            this.propertiesMap.set(key, value);
    }
    
    get(name)  {
        return this.propertiesMap.get(name);
    }

    set(key, value) {
        this.propertiesMap.set(key, value);
    }

}