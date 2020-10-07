import lodash from 'lodash';

import { performLoop } from '../common/loop.mjs';
import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';
import { processASTNode, processSingleASTNode } from './nodeType.mjs';

export function handleForStatement(forNode) {

    increaseScope();

    processASTNode(forNode.init);

    let arr;
    if (forNode.body.body) {
        arr = lodash.cloneDeep(forNode.body.body);
    } else {
        arr = [lodash.cloneDeep(forNode.body)];
    }
    arr.push(forNode.update);
    performLoop(forNode.test, arr);

    decreaseScope();
}