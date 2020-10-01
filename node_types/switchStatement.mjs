import { decreaseScope } from "../types/variable.mjs";
import { increaseScope } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";
import { processSingleASTNode } from "./nodeType.mjs";


export function handleSwitchStatement(switchNode) {

    increaseScope();

    let caseNodes = [];
    switchNode.cases.forEach(switchCase => {
        caseNodes[caseNodes.length] = switchCase;
    });

    // Solve discriminant
    let variableResult = processSingleASTNode(switchNode.discriminant);

    if (variableResult.value) {
        solveDeterminantSwitch(variableResult.value, switchNode)
    }


    decreaseScope();
}

function solveDeterminantSwitch(value, switchNode) {

    let caseNodes = [];
    switchNode.cases.forEach(switchCase => {
        caseNodes[caseNodes.length] = switchCase;
    });


    for (let i = 0; i < switchNode.cases.length; i++) {
        let testResult = processSingleASTNode(switchNode.cases[i].test).value;
        if (testResult && testResult === value) {
            processASTNode(caseNodes);
            break;
        } else {
            caseNodes.shift();
        }
    }
}