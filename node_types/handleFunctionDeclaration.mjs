import { createUnknownVariableDeclaratorNode } from "../ast_utilities/nodes.mjs";
import { processASTNode } from "./nodeType.mjs";
import { handleVariableDeclarator } from "./variableDeclarator.mjs";


export function handleFunctionDeclaration(functionNode) {

    functionNode.params.forEach(param => {
        handleVariableDeclarator(createUnknownVariableDeclaratorNode(param.name));
    });

    processASTNode(functionNode.body);
}