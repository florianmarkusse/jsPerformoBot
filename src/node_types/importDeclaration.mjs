import { createUnknownVariableDeclaratorNode } from "../ast_utilities/nodes.mjs";
import { createCallExpressionNode } from "../ast_utilities/nodes.mjs";
import { handleVariableDeclarator } from "./variableDeclarator.mjs";


export function handleImportDeclaration(importNode) {
    importNode.specifiers.forEach(importSpecifier => {
        handleVariableDeclarator(createUnknownVariableDeclaratorNode(importSpecifier.local.name));
    });
}