import { getVariable } from "./nodeType.mjs";
import { NaNVariable } from "../types/NaNVariable.mjs";
import { LiteralVariable } from "../types/literalVariable.mjs";
import { VariableType } from "../types/variable.mjs";
import { preUnaryOperation } from "../common/stringEval.mjs";

export function handleUnaryExpression(unaryNode) {
    let variable = getVariable(unaryNode.argument);

    if (variable.type === VariableType.literal && !isNaN(variable.value)) {
        return new LiteralVariable(preUnaryOperation(unaryNode.operator, variable.value));
    } else {
        return new NaNVariable();
    }
}