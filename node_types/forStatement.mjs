import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleForStatement(forNode) {
    processASTNode(forNode.init);
    
    while (processSingleASTNode(forNode.test)) {
        processASTNode(forNode.body);
        processASTNode(forNode.update);
    }

}