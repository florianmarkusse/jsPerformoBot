import {VariableType} from './variable.mjs';

export class UnknownVariable {
    constructor() {
        this.type = VariableType.unknown;
    }

    getWithNode() {
        return new UnknownVariable();
    }

    get() {
        return new UnknownVariable();
    }
}