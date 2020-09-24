import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';
import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleWhileStatement(whileNode) {
    
    increaseScope();

    while (processSingleASTNode(whileNode.test).value) {
        whileNode.body.body.forEach(node => {
            processASTNode(node);
        });
    }

    decreaseScope();

}