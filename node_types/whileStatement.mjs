import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleWhileStatement(whileNode) {
    
    while (processSingleASTNode(whileNode.test).value) {
        processASTNode(whileNode.body);
    }

}