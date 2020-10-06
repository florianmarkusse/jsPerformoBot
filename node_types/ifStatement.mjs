import { processSingleASTNode } from "./nodeType.mjs";
import { VariableType } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";
import { increaseScope } from "../types/variable.mjs";
import { decreaseScope } from "../types/variable.mjs";
import { increaseUnknownLoopNumber } from "../types/variable.mjs";
import { decreaseUnknownLoopNumber } from "../types/variable.mjs";



export function handleIfStatement(ifNode) {

    increaseUnknownLoopNumber();
    increaseScope();
    if (ifNode.consequent) {
        processASTNode(ifNode.consequent.body);
    }
    decreaseScope();
    decreaseUnknownLoopNumber();

    increaseUnknownLoopNumber();
    increaseScope();
    if (ifNode.alternate) {
        processASTNode(ifNode.alternate.body);
    }
    decreaseScope();
    decreaseUnknownLoopNumber();
}