import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';
import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleForStatement(forNode) {

    increaseScope();

    processASTNode(forNode.init);
    
    while (processSingleASTNode(forNode.test).value) {

        forNode.body.body.forEach(node => {
            processASTNode(node);
        });
        processASTNode(forNode.update);
    }

    decreaseScope();

}