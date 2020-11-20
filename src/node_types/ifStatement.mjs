import { processSingleASTNode } from "./nodeType.mjs";
import { VariableType } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";
import { increaseScope } from "../types/variable.mjs";
import { decreaseScope } from "../types/variable.mjs";
import { increaseUnknownLoopNumber } from "../types/variable.mjs";
import { decreaseUnknownLoopNumber } from "../types/variable.mjs";
import { NodeType } from "./nodeType.mjs";



export function handleIfStatement(ifNode) {

    processASTNode(ifNode.test);


    increaseUnknownLoopNumber();
    increaseScope();
    if (ifNode.consequent) {
        if (ifNode.consequent.body && ifNode.consequent.type === NodeType.BlockStatement) {
            processASTNode(ifNode.consequent.body);
        } else {
            processASTNode(ifNode.consequent);
        }
    }
    decreaseScope();
    decreaseUnknownLoopNumber();

    increaseUnknownLoopNumber();
    increaseScope();
    if (ifNode.alternate) {
        if (ifNode.alternate.body && ifNode.alternate.type === NodeType.BlockStatement) {
            processASTNode(ifNode.alternate.body);
        } else {
            processASTNode(ifNode.alternate);
        }
    }  
    decreaseScope();
    decreaseUnknownLoopNumber();
}