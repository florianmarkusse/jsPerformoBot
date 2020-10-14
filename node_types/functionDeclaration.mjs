import pkg from 'estree-walker'; 
const {walk} = pkg;

import { createUnknownVariableDeclaratorNode } from "../ast_utilities/nodes.mjs";
import { UnknownVariable } from "../types/unknownVariable.mjs";
import { increaseUnknownLoopNumber } from "../types/variable.mjs";
import { decreaseUnknownLoopNumber } from "../types/variable.mjs";
import { decreaseScope } from "../types/variable.mjs";
import { increaseScope } from "../types/variable.mjs";
import { NodeType } from './nodeType.mjs';
import { processASTNode } from "./nodeType.mjs";
import { handleVariableDeclarator } from "./variableDeclarator.mjs";


export function handleFunctionDeclaration(functionNode) {

    increaseUnknownLoopNumber();
    increaseScope();
    

    walk( functionNode.params, {
        enter: function ( node, parent, prop, index ) {
            if (node.type === NodeType.Identifier) {
                handleVariableDeclarator(createUnknownVariableDeclaratorNode(node.name))
            }
        },
        leave: function ( node, parent, prop, index ) {
        }
    });


    if (functionNode.body.body) {
        processASTNode(functionNode.body.body);
    } else {
        processASTNode(functionNode.body);
    }

    decreaseScope();
    decreaseUnknownLoopNumber();

    return new UnknownVariable();
}