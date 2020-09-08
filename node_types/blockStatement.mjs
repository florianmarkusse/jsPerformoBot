import { processASTNode } from "./nodeType.mjs";

export function handleBlockStatement(blockNode) {
    blockNode.body.body.forEach(node => {
        processASTNode(node);
    });
}