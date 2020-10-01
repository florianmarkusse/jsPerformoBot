import {VariableType} from './variable.mjs';
import { getVariable } from '../node_types/nodeType.mjs';
import { ReverseArrayWrite } from '../fixes/reverseArrayWrite.mjs';
import { addToFixSet } from '../fixes/fix.mjs';
import { deleteFromFixSet } from '../fixes/fix.mjs';
import { UndefinedVariable } from '../types/undefinedVariable.mjs';
import { UnknownVariable } from "../types/unknownVariable.mjs";
import { UndefinedRead } from '../fixes/undefinedRead.mjs';
import { inUnknownLoop } from './variable.mjs';

export class ArrayVariable {
    constructor(elements) {
        this.elements = [];
        

        elements.forEach(element => {
            this.addElement(element);
        });

        this.setValue();

        // Map from variables or constants to which index in the array they set.
        this.setMap = new Map();
        this.reverseFix = undefined;
        this.type = VariableType.array;
    }

    addElement(elementNode) {
        this.elements[this.elements.length] = getVariable(elementNode);
        this.setValue();
    }

    setValue() {
        let array = [];
        for (const element of this.elements) {
            if (element !== undefined) {
                array[array.length] = element.value;
            }
        }
        this.value = array;
    }

    get(index) {
        if (this.elements[index] !== undefined) {
            return this.elements[index];
        } else {
            return new UndefinedVariable();
        }
    }

    getWithNode(index, node) {
        if (this.elements[index] !== undefined) {
            return this.elements[index];
        } else {
            addToFixSet(new UndefinedRead(node));
            return new UndefinedVariable();
        }
    }

    set(index, element, key, name) {
        if (this.firstWrite(index) && isNaN(key)) {
            this.setMap.set(index, key);
        }
        if (inUnknownLoop()) {
            this.elements[index] = new UnknownVariable();
        } else {
            this.elements[index] = element;
        }
        this.needsFixing(name);
        this.setValue();
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
            deleteFromFixSet(this.reverseFix);
            this.reverseFix = new ReverseArrayWrite(this.setMap, name);
            addToFixSet(this.reverseFix);
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