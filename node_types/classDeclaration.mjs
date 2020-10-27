import { decreaseScope } from "../types/variable.mjs";
import { createVariable } from "../types/variable.mjs";
import { increaseScope } from "../types/variable.mjs";
import { processASTNode } from "./nodeType.mjs";
import { ObjectVariable } from "../types/objectVariable.mjs";

export function handleClassDeclaration(classNode) {

    increaseScope();

    if (classNode.superClass !== null) {
        createVariable("super", new ObjectVariable([]));
        createVariable("this", new ObjectVariable([{}], true));
    } else {
        createVariable("this", new ObjectVariable([], true));
    }
    

    processASTNode(classNode.body);

    decreaseScope();

}