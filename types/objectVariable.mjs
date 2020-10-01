import {VariableType} from './variable.mjs';
import { NodeType, getVariable } from '../node_types/nodeType.mjs';
import { UndefinedVariable } from '../types/undefinedVariable.mjs';
import { addToFixSet } from '../fixes/fix.mjs';
import { UndefinedRead } from '../fixes/undefinedRead.mjs';
import { inUnknownLoop } from './variable.mjs';
import { UnknownVariable } from "../types/unknownVariable.mjs";

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
    
    getWithNode(name, node)  {
        if (this.propertiesMap.has(name)) {
            return this.propertiesMap.get(name);
        } else {
            addToFixSet(new UndefinedRead(node));
            return new UndefinedVariable();
        }
    }

    set(key, value) {
        if (inUnknownLoop()) {
            this.propertiesMap.set(key, new UnknownVariable());
        } else {
            this.propertiesMap.set(key, value);
        }
    }

}