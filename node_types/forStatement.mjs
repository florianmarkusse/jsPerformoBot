import { processASTNode } from './nodeType.mjs';

export function handleForStatement(forNode) {
    console.log(forNode.update);
    processASTNode(forNode.init);

    while (test(forNode.test)) {
        processASTNode(forNode.body);
        //update()
    }

}

function test(testNode) {
    return false;
}