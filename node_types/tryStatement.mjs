import lodash from "lodash";

import { processASTNode } from "./nodeType.mjs";
import { increaseUnknownLoopNumber } from "../types/variable.mjs";
import { decreaseUnknownLoopNumber } from "../types/variable.mjs";
import { increaseScope } from "../types/variable.mjs";
import { decreaseScope } from "../types/variable.mjs";


export function handleTryStatement(tryNode) {

    increaseUnknownLoopNumber();
    
    processASTNode(tryNode.block);

    if (tryNode.handler !== null) {
        increaseScope();

        let arr = lodash.cloneDeep(tryNode.handler.body.body);
        arr.push(tryNode.handler.param);
        processASTNode(arr);

        decreaseScope();
    }

    decreaseUnknownLoopNumber();

    if (tryNode.finalizer !== null) {
        processASTNode(tryNode.finalizer);
    }
}