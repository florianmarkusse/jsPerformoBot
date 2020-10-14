import {VariableType} from './variable.mjs';
import { getVariable } from '../node_types/nodeType.mjs';
import { ReverseArrayWrite } from '../fixes/reverseArrayWrite.mjs';
import { addToFixSet } from '../fixes/fix.mjs';
import { deleteFromFixSet } from '../fixes/fix.mjs';
import { UndefinedVariable } from '../types/undefinedVariable.mjs';
import { UnknownVariable } from "../types/unknownVariable.mjs";
import { UndefinedRead } from '../fixes/undefinedRead.mjs';
import { inUnknownLoop } from './variable.mjs';
import { getFromVariables } from './variable.mjs';

export class ArrayVariable {
    constructor(elements) {
        this.elements = [];
        this.isKnown = true;

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

        if (!this.isKnown) {
            return new UnknownVariable();
        }

        if (typeof index === 'string' || index instanceof String) {
            index = getFromVariables(index).value;
        }

        if (!isNaN(index) && this.elements[index]) {
            return this.elements[index];
        } else {
            return new UndefinedVariable();
        }
    }

    getWithNode(index, node) {

        if (!this.isKnown) {
            return new UnknownVariable();
        }

        let val;
        if (typeof index === 'string' || index instanceof String) {
            val = getFromVariables(index).value;
        } else {
            val = index;
        }

        if (this.elements[val] !== undefined) {
            return this.elements[val];
        } else {
            //if (getFromVariables(val).type === VariableType.undefined && !isNaN(index)) {
            //    addToFixSet(new UndefinedRead(node));
            //    return new UndefinedVariable();
            //}
            return new UnknownVariable();
        }
    }

    set(index, element, key, name) {

        if (typeof index === 'string' || index instanceof String) {
            index = getFromVariables(index).value;
        }

        if (isNaN(index)) {
            this.isKnown = false;
            this.value = undefined;
        }

        if (this.isKnown) {
            if (this.firstWrite(index) && isNaN(key)) {
                this.setMap.set(index, key);
            }
            if (inUnknownLoop(name)) {
                this.elements[index] = new UnknownVariable();
            } else {
                this.elements[index] = element;
            }
            this.needsFixing(name);
            this.setValue();
        }
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