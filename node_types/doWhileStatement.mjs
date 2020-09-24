import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';
import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleDoWhileStatement(doWhileNode) {
    
    increaseScope();

    doWhileNode.body.body.forEach(node => {
        processASTNode(node);
    });

    while (processSingleASTNode(doWhileNode.test).value) {
        doWhileNode.body.body.forEach(node => {
            processASTNode(node);
        });
    }

    decreaseScope();

}