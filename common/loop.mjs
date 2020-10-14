import { processASTNode } from "../node_types/nodeType.mjs";
import { processSingleASTNode } from "../node_types/nodeType.mjs";
import { decreaseUnknownLoopNumber } from "../types/variable.mjs";
import { increaseUnknownLoopNumber } from "../types/variable.mjs";
import { VariableType } from '../types/variable.mjs';

export function performLoop(testNode, bodyNodes) {

    processASTNode(testNode);

    increaseUnknownLoopNumber();
    processASTNode(bodyNodes);
    decreaseUnknownLoopNumber();
}