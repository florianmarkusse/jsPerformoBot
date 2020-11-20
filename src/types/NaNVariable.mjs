import {VariableType} from './variable.mjs';

export class NaNVariable {
    constructor() {
        this.type = VariableType.NaN;
        this.value = NaN;
    }
}