import {VariableType} from './variable.mjs';

export class NotDefinedVariable {
    constructor() {
        this.type = VariableType.notDefined;
    }
}