import { replaceNodeFromAST } from "../ast_utilities/astTraversal.mjs";
import { createIdentifierNode } from "../ast_utilities/nodes.mjs";

export class UndefinedRead {

    constructor(memberNode) {
        this.memberNode = memberNode;
    }


    fix(ast) {
        replaceNodeFromAST(ast, this.memberNode, createIdentifierNode('undefined'));
    }

    isEqualTo(undefinedRead) {
        return false;
    }
}