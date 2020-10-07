import { performLoop } from '../common/loop.mjs';
import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';
import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleDoWhileStatement(doWhileNode) {
    
    increaseScope();

    if (doWhileNode.body.body) {
        processASTNode(doWhileNode.body.body);
        performLoop(doWhileNode.test, doWhileNode.body.body);
    } else {
        processASTNode(doWhileNode.body);
        performLoop(doWhileNode.test, doWhileNode.body);
    }

    

    decreaseScope();
}