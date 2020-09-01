import {Variable, VariableType} from './variable.mjs';

export class LiteralVariable extends  Variable {
    constructor(value) {
        super();

        this.value = value;
        this.type = VariableType.literal;
    }

    assignValue(value) {
        this.value = value;
    }


}