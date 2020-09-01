import {Variable, VariableType} from './variable.mjs';

export class UnknownVariable extends Variable {
    constructor() {
        super();
        this.type = VariableType.unknown;
    }
}