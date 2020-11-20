import lodash from 'lodash';

import { performLoop } from '../common/loop.mjs';
import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';
import { NodeType } from './nodeType.mjs';

export function handleWhileStatement(whileNode) {
    increaseScope();

    let arr;
    if (whileNode.body.body && whileNode.body.body.type === NodeType.BlockStatement) {
        arr = lodash.cloneDeep(whileNode.body.body);
    } else {
        arr = [lodash.cloneDeep(whileNode.body)];
    }

    performLoop(whileNode.test, arr);
    decreaseScope();
}