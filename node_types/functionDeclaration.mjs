import { createUnknownVariableDeclaratorNode } from "../ast_utilities/nodes.mjs";
import { decreaseScope } from "../types/variable.mjs";
import { increaseScope } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";
import { handleVariableDeclarator } from "./variableDeclarator.mjs";


export function handleFunctionDeclaration(functionNode) {

    increaseScope();

    functionNode.params.forEach(param => {
        handleVariableDeclarator(createUnknownVariableDeclaratorNode(param.name));
    });

    processASTNode(functionNode.body.body);

    decreaseScope();
}