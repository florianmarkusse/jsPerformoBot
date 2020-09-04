import {Variable, VariableType} from './variable.mjs';
import { getVariable } from '../node_types/nodeType.mjs';

export const ArrayState = Object.freeze({
    'unkown': 'unkown', 
    'numeric': 'numeric',
    'nonNumeric': 'nonNumeric',
})

export const ContiguityResult = Object.freeze({
    'fine':'fine',
    'nonNumeric': 'nonNumeric',
    'nonContiguous':'nonContiguous',
})

export class ArrayVariable extends Variable {
    constructor(elements) {
        super();

        this.elements = [];

        elements.forEach(element => {
            this.addElement(element);
        });

        this.arrayState = checkArrayType(elements);
        this.type = VariableType.array;
    }

    addElement(elementNode) {
        this.elements[this.elements.length] = getVariable(elementNode);
    }

    get(index) {
        return this.elements[index];
    }

    set(index, element) {
        this.elements[index] = element;
    }


    updateArrayVariable(key, value) {

        // Check for non-contigious array usage.
        this.checkForcontiguity(key);
        // Check for numeric to non-numeric array transformation.
        this.checkNumericToNonNumeric(value);

        this.elements[key] = value;
    }

    checkForcontiguity(key) {
        if (!Number.isInteger(key) || key < 0) {
            return ContiguityResult.nonNumeric;
        } else {
            if (key > this.elements.length) {
                return ContiguityResult.nonContiguous;
            }
        }
        return ContiguityResult.fine;
    }

    checkNumericToNonNumeric(value) {
        
        if (isNaN(value)) {
            if (this.arrayState === ArrayState.numeric) {
                console.log(`switched '${this.name}' array from numeric to non-numeric`);
                this.arrayState = ArrayState.nonNumeric;
                return true;
            }
            this.arrayState = ArrayState.nonNumeric;
        } else {
            this.arrayState = ArrayState.numeric;
        }
        return false;
    }
}


function checkArrayType(elements) {
    let arrayType = ArrayState.unkown;


    if (elements.length > 0) {
        arrayType = ArrayState.numeric;
    }

    elements.forEach(element => {
        if (isNaN(element.value)) {
            arrayType = ArrayState.nonNumeric;
        }
    });

    return arrayType;
}