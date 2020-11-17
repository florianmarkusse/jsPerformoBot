import { getVariable } from "./nodeType.mjs";
import { NaNVariable } from "../types/NaNVariable.mjs";
import { LiteralVariable } from "../types/literalVariable.mjs";
import { VariableType } from "../types/variable.mjs";
import { preUnaryOperation } from "../common/stringEval.mjs";
import { NotDefinedVariable } from "../types/notDefinedVariable.mjs";
import { UnknownVariable } from "../types/unknownVariable.mjs";

export function handleUnaryExpression(unaryNode) {

    if (unaryNode.operator === "delete" ||
    unaryNode.operator === "void" ||
    unaryNode.operator === "typeof") {
        getVariable(unaryNode.argument);
        return new UnknownVariable();
    }

    let variable = getVariable(unaryNode.argument);

    if (variable.type === VariableType.unknown) {
        return new UnknownVariable();
    }

    if (variable.type === VariableType.notDefined) {
        return new NotDefinedVariable();
    }

    let nanCheck;
    try {
        nanCheck = !isNaN(variable.value)
    } catch (err) {
        return new UnknownVariable();
    }
    

    if (variable.type === VariableType.literal && nanCheck) {
        let result = preUnaryOperation(unaryNode.operator, variable.value);
        if (result === "joghdfgdfbgkldfndfgfdgjdfpg") {
            return new UnknownVariable();
        }
        return new LiteralVariable(result);
    } else {
        return new NaNVariable();
    }
}