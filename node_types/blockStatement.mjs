import { decreaseScope } from "../types/variable.mjs";
import { increaseScope } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";

export function handleBlockStatement(blockNode) {

    // New scope
    increaseScope();

    processASTNode(blockNode);

    // End scope.
    decreaseScope();
    
}