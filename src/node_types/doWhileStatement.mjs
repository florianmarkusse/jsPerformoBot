import lodash from 'lodash';

import { performLoop } from '../common/loop.mjs';
import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';
import { processASTNode, processSingleASTNode } from './nodeType.mjs';
import { NodeType } from './nodeType.mjs';

export function handleDoWhileStatement(doWhileNode) {
    
    increaseScope();

    let arr;
    if (doWhileNode.body.body && doWhileNode.body.body.type === NodeType.BlockStatement) {
        arr = lodash.cloneDeep(doWhileNode.body.body);
    } else {
        arr = [lodash.cloneDeep(doWhileNode.body)];
    }

    if (doWhileNode.body.body && doWhileNode.body.body.type === NodeType.BlockStatement) {
        processASTNode(doWhileNode.body.body);
    } else {
        processASTNode(doWhileNode.body);
    }
    performLoop(doWhileNode.test, arr);

    decreaseScope();
}