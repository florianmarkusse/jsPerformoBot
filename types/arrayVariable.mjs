import {VariableType} from './variable.mjs';
import { getVariable } from '../node_types/nodeType.mjs';
import { ReverseArrayWrite } from '../fixes/reverseArrayWrite.mjs';
import { addToFixSet } from '../fixes/fix.mjs';
import { deleteFromFixSet } from '../fixes/fix.mjs';

export class ArrayVariable {
    constructor(elements) {
        this.elements = [];

        elements.forEach(element => {
            this.addElement(element);
        });

        // Map from variables or constants to which index in the array they set.
        this.setMap = new Map();
        this.fix = undefined;
        this.type = VariableType.array;
    }

    addElement(elementNode) {
        this.elements[this.elements.length] = getVariable(elementNode);
    }

    get(index) {
        return this.elements[index];
    }

    set(index, element, key, name) {
        if (this.firstWrite(index)) {
            this.setMap.set(index, key);
        }
        this.elements[index] = element;
        this.needsFixing(name);
    }

    firstWrite(index) {
        return (this.elements[index] === undefined);
    } 


    setMapPair(key, index) {
        if (this.firstWrite(index)) {
            this.setMap.set(index, key);
        }
    }

    needsFixing(name) {
        if (this.isReverse(Array.from(this.setMap.keys()))) {
            console.log("is written to in reverse");
            
            deleteFromFixSet(this.fix);
            this.fix = new ReverseArrayWrite(this.setMap, name);
            addToFixSet(this.fix);
        }
    }

    isReverse(array) {
        if (array.length <= 1) {
            return false;
        }
        return array.every(function (x, i) {
            return i === 0 || x === array[i - 1] - 1;
        });
    }
}