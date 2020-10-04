import { decreaseScope } from "../types/variable.mjs";
import { increaseScope } from "../types/variable.mjs";
import { increaseUnknownLoopNumber } from "../types/variable.mjs";
import { decreaseUnknownLoopNumber } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";
import { processSingleASTNode } from "./nodeType.mjs";


export function handleSwitchStatement(switchNode) {

    increaseScope();
    increaseUnknownLoopNumber();

    switchNode.cases.forEach(switchCase => {
        processASTNode(switchCase);
    });

    decreaseUnknownLoopNumber();
    decreaseScope();
}