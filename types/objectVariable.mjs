import {VariableType} from './variable.mjs';
import { NodeType, getVariable } from '../node_types/nodeType.mjs';
import { UndefinedVariable } from '../types/undefinedVariable.mjs';

export class ObjectVariable {

    constructor(properties) {
        this.type = VariableType.object;
        this.value = {};
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
        if (this.propertiesMap.has(name)) {
            return this.propertiesMap.get(name);
        } else {
            return new UndefinedVariable();
        }
    }

    set(key, value) {
        this.propertiesMap.set(key, value);
    }

}