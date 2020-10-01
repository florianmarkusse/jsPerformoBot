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
        ifNode.consequent.body.forEach(node => {
            processASTNode(node);
        });
        decreaseScope();
        decreaseUnknownLoopNumber();

        increaseUnknownLoopNumber();
        increaseScope();
        ifNode.alternate.body.forEach(node => {
            processASTNode(node);
        });
        decreaseScope();
        decreaseUnknownLoopNumber();
    } else {
        if (variableResult.value) {
            increaseScope();
            ifNode.consequent.body.forEach(node => {
                processASTNode(node);
            });
            decreaseScope();
        } else {
            increaseScope();
            ifNode.alternate.body.forEach(node => {
                processASTNode(node);
            });
            decreaseScope();
        }
    }

    
}