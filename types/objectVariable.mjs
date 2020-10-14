import {VariableType} from './variable.mjs';
import { NodeType, getVariable } from '../node_types/nodeType.mjs';
import { UndefinedVariable } from '../types/undefinedVariable.mjs';
import { addToFixSet } from '../fixes/fix.mjs';
import { UndefinedRead } from '../fixes/undefinedRead.mjs';
import { inUnknownLoop } from './variable.mjs';
import { UnknownVariable } from "../types/unknownVariable.mjs";
import { getFromVariables } from './variable.mjs';
import { getParent } from '../ast_utilities/astTraversal.mjs';
import { getBaseAST } from '../app.mjs';

let reservedKeyWords = [
    'toString',
    'toLocaleString',
    'valueOf',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    '__defineGetter__',
    '__definedSetter__',
    '__lookupGetter__',
    '__lookupSetter__',
    '__proto__',
    'construnctor',
];

export class ObjectVariable {

    constructor(properties) {
        this.type = VariableType.object;
        this.value = {};
        this.propertiesMap = new Map();
        this.known = true;

        properties.forEach(property => {
            this.addProperty(property);
        });

    }

    addProperty(property) {
        let key;
        if (property.key) {
            if (property.key.type === NodeType.Identifier) {
                key = property.key.name;
            } else {
                key = property.key.value;
            }

            let value = getVariable(property.value);
            this.propertiesMap.set(key, value);
        } else {
            this.known = false;
        }
    }

    get(name)  {
        if (this.propertiesMap.has(name)) {
            return this.propertiesMap.get(name);
        } else {
            return new UnknownVariable();
        }
    }
    
    getWithNode(name, node)  {
        if (this.propertiesMap.has(name)) {
            return this.propertiesMap.get(name);
        } else {
            let constructorOrProgram = getOuterLoop(node);
            if (getFromVariables(name).type === VariableType.notDefined && 
                !reservedKeyWords.includes(name) && this.known &&
                constructorOrProgram.type === NodeType.MethodDefinition &&
                constructorOrProgram.kind === "constructor") {
                addToFixSet(new UndefinedRead(node));
                return new UndefinedVariable();
            }
            return new UnknownVariable();
        }
    }

    set(key, value, property, name) {
        if (inUnknownLoop(name)) {
            this.propertiesMap.set(key, new UnknownVariable());
        } else {
            this.propertiesMap.set(key, value);
        }
    }

    delete(key) {
        if (this.propertiesMap.has(key)) {
            thiis.propertiesMap.delete(key);
        }
    }

}

function getOuterLoop(node) {
    if (node && (
        node.type !== NodeType.MethodDefinition &&
        node.type !== NodeType.Program)
     ) {
            return getOuterLoop(getParent(getBaseAST(), node))
        } else {
            return node;
        }
}