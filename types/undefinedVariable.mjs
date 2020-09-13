import {VariableType} from './variable.mjs';

export class UndefinedVariable {
    constructor() {
        this.type = VariableType.undefined;
        this.value = undefined;
    }
}