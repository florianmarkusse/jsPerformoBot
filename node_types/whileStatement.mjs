import { performLoop } from '../common/loop.mjs';
import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';

export function handleWhileStatement(whileNode) {
    increaseScope();
    if (whileNode.body.body) {
        performLoop(whileNode.test, whileNode.body.body);
    } else {
        performLoop(whileNode.test, whileNode.body);
    }
    decreaseScope();
}