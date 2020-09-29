import { performLoop } from '../common/loop.mjs';
import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';
import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleDoWhileStatement(doWhileNode) {
    
    increaseScope();

    doWhileNode.body.body.forEach(node => {
        processASTNode(node);
    });

    performLoop(doWhileNode.test, doWhileNode.body.body);

    decreaseScope();
}