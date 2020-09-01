import {Variable, VariableType} from './variable.mjs';

export class UndefinedVariable extends Variable {
    constructor() {
        super();
        this.type = VariableType.undefined;
    }
}