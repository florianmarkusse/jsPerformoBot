import {VariableType} from './variable.mjs';

export class LiteralVariable {
    constructor(value) {
        this.value = value;
        this.type = VariableType.literal;
    }

    assignValue(value) {
        this.value = value;
    }


}