import { processASTNode } from "../node_types/nodeType.mjs";
import { processSingleASTNode } from "../node_types/nodeType.mjs";
import { decreaseUnknownLoopNumber } from "../types/variable.mjs";
import { increaseUnknownLoopNumber } from "../types/variable.mjs";
import { getVariable } from '../node_types/nodeType.mjs';
import { VariableType } from '../types/variable.mjs';

export function performLoop(testNode, bodyNodes) {

    processASTNode(testNode);
    let result = getVariable(testNode);

    while (result.type === 'literal' && result.value) {
        processASTNode(bodyNodes);
        processASTNode(testNode);
        result = getVariable(testNode);
    }

    if (result.type === 'unknown') {
        increaseUnknownLoopNumber();
        processASTNode(bodyNodes);
        decreaseUnknownLoopNumber();
    }
}