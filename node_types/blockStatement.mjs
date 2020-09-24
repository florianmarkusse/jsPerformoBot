import { decreaseScope } from "../types/variable.mjs";
import { increaseScope } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";

export function handleBlockStatement(blockNode) {

    // New scope
    increaseScope();

    blockNode.body.forEach(node => {
        processASTNode(node);
    });

    // End scope.
    decreaseScope();
    
}