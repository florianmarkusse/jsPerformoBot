import { createUnknownVariableDeclaratorNode } from "../ast_utilities/nodes.mjs";
import { UnknownVariable } from "../types/unknownVariable.mjs";
import { increaseUnknownLoopNumber } from "../types/variable.mjs";
import { decreaseUnknownLoopNumber } from "../types/variable.mjs";
import { decreaseScope } from "../types/variable.mjs";
import { increaseScope } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";
import { handleVariableDeclarator } from "./variableDeclarator.mjs";


export function handleFunctionDeclaration(functionNode) {

    increaseUnknownLoopNumber();
    increaseScope();
    

    functionNode.params.forEach(param => {
        handleVariableDeclarator(createUnknownVariableDeclaratorNode(param.name));
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