import lodash from 'lodash';
import pkg from 'estree-walker'; 
const {walk} = pkg;

import { createUnknownVariableDeclaratorNode } from '../ast_utilities/nodes.mjs';
import { NodeType } from './nodeType.mjs';
import { handleVariableDeclarator } from './variableDeclarator.mjs';
import { performLoop } from '../common/loop.mjs';
import { decreaseScope } from '../types/variable.mjs';
import { increaseScope } from '../types/variable.mjs';


export function handleForInStatement(forInNode) {
    increaseScope();

    walk( forInNode.left, {
        enter: function ( node, parent, prop, index ) {
            if (node.type === NodeType.Identifier) {
                handleVariableDeclarator(createUnknownVariableDeclaratorNode(node.name))
            }
        },
        leave: function ( node, parent, prop, index ) {
        }
    });

    let arr;

    if (forInNode.body.body && forInNode.body.type === NodeType.BlockStatement) {
        arr = lodash.cloneDeep(forInNode.body.body);
    } else {
        arr = [lodash.cloneDeep(forInNode.body)];
    }

    performLoop(null, arr);

    decreaseScope();
}