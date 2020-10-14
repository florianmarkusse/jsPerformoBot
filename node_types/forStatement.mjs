import lodash from 'lodash';

import { performLoop } from '../common/loop.mjs';
import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';
import { NodeType } from './nodeType.mjs';
import { processASTNode } from './nodeType.mjs';

export function handleForStatement(forNode) {

    increaseScope();

    processASTNode(forNode.init);

    let arr;

    if (forNode.body.body && forNode.body.type === NodeType.BlockStatement) {
        arr = lodash.cloneDeep(forNode.body.body);
    } else {
        arr = [lodash.cloneDeep(forNode.body)];
    }

    arr.push(forNode.update);
    performLoop(forNode.test, arr);

    decreaseScope();
}