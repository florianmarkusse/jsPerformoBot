import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleWhileStatement(whileNode) {
    
    while (processSingleASTNode(whileNode.test)) {
        processASTNode(whileNode.body);
    }

}