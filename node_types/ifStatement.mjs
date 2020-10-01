import { processSingleASTNode } from "./nodeType.mjs";
import { VariableType } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";
import { increaseScope } from "../types/variable.mjs";
import { decreaseScope } from "../types/variable.mjs";
import { increaseUnknownLoopNumber } from "../types/variable.mjs";
import { decreaseUnknownLoopNumber } from "../types/variable.mjs";



export function handleIfStatement(ifNode) {

    // Solve test
    let variableResult = processSingleASTNode(ifNode.test);

    if (variableResult.type === VariableType.unknown) {

        increaseUnknownLoopNumber();
        increaseScope();
        processASTNode(ifNode.consequent.body);
        decreaseScope();
        decreaseUnknownLoopNumber();

        increaseUnknownLoopNumber();
        increaseScope();
        processASTNode(ifNode.alternate.body);
        decreaseScope();
        decreaseUnknownLoopNumber();
    } else {
        if (variableResult.value) {
            increaseScope();
            processASTNode(ifNode.consequent.body);
            decreaseScope();
        } else {
            increaseScope();
            processASTNode(ifNode.alternate.body);
            decreaseScope();
        }
    }

    
}