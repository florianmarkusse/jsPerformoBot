import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleDoWhileStatement(doWhileNode) {
    
    processASTNode(doWhileNode.body);

    while (processSingleASTNode(doWhileNode.test)) {
        processASTNode(doWhileNode.body);
    }

}