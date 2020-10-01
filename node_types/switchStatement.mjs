import { decreaseScope } from "../types/variable.mjs";
import { increaseScope } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";
import { processSingleASTNode } from "./nodeType.mjs";


export function handleSwitchStatement(switchNode) {

    increaseScope();

    // Solve discriminant
    let variableResult = processSingleASTNode(switchNode.discriminant);

    if (variableResult.value) {
        solveDeterminantSwitch(value, switchNode)
    }


    decreaseScope();
}

function solveDeterminantSwitch(value, switchNode) {
    for (let i = 0; i < switchNode.cases.length; i++) {
        if (value === processSingleASTNode(switchNode.cases[i].test)) {
            processASTNode(switchNode.cases[i].consequent);
        }
    }
}