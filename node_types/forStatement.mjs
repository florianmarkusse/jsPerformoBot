import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleForStatement(forNode) {
    processASTNode(forNode.init);
    
    while (processSingleASTNode(forNode.test).value) {
        processASTNode(forNode.body);
        processASTNode(forNode.update);
    }

}