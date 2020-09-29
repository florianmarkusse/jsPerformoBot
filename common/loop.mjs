import { processASTNode } from "../node_types/nodeType.mjs";
import { processSingleASTNode } from "../node_types/nodeType.mjs";
import { decreaseUnknownLoopNumber } from "../types/variable.mjs";
import { increaseUnknownLoopNumber } from "../types/variable.mjs";
import { VariableType } from '../types/variable.mjs';

export function performLoop(testNode, bodyNodes) {

    let variableResult = processSingleASTNode(testNode);

    if (variableResult.type === VariableType.unknown) {
        increaseUnknownLoopNumber();
        bodyNodes.forEach(node => {
            processASTNode(node);
        });
        decreaseUnknownLoopNumber();
    } else {
        while (variableResult.value) {
            bodyNodes.forEach(node => {
                processASTNode(node);
            });
            variableResult = processSingleASTNode(testNode);
        }
    }
}