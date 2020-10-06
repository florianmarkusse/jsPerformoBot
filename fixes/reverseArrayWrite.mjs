import lodash from 'lodash';

import { getUpdateNodesInLoop } from '../ast_utilities/astTraversal.mjs';
import { getNodelastAssignedVariable } from '../ast_utilities/astTraversal.mjs';
import { getParent } from '../ast_utilities/astTraversal.mjs';
import { removeNodeFromAST } from '../ast_utilities/astTraversal.mjs';
import { replaceNodeFromAST } from '../ast_utilities/astTraversal.mjs';
import { getASTUntil } from '../ast_utilities/astTraversal.mjs';
import { nodeUsesIdentifier } from '../ast_utilities/astTraversal.mjs';
import { getFirstLoopNodeArrayWrittenTo } from '../ast_utilities/astTraversal.mjs';
import { createUpdateExpressionNode } from '../ast_utilities/nodes.mjs';
import { createLogicalExpressionNode } from '../ast_utilities/nodes.mjs';
import { createVariableDeclaratorNode } from '../ast_utilities/nodes.mjs';
import { createExpressionStatementNode } from '../ast_utilities/nodes.mjs';
import { createBinaryExpressionNode } from '../ast_utilities/nodes.mjs';
import { createAssignmentExpressionNode } from '../ast_utilities/nodes.mjs';
import { createLiteralNode } from '../ast_utilities/nodes.mjs';
import { NodeType } from '../node_types/nodeType.mjs';

export class ReverseArrayWrite {
    constructor(setMap, name) {
        this.setMap = setMap;
        this.name = name;
    }

    fix(ast) {
        let reverseMap = this.findvariables(this.setMap);
        reverseMap = this.filterReverseMap(reverseMap);
        for (const [key, value] of reverseMap) {
            let loopNode = getFirstLoopNodeArrayWrittenTo(ast, this.name, key);

            let updateNodes = getUpdateNodesInLoop(loopNode.update, key);
            updateNodes.push(...getUpdateNodesInLoop(loopNode.body.body, key));

            // Check if does more than writing to array.
            let updateNodesSet = new Set(updateNodes);
            let filterResult = loopNode.body.body.filter(x => !updateNodesSet.has(x));
            let nonUpdateLoopNodes = new Set(filterResult);

            let count = 0;
            for (const nonUpdateLoopNode of nonUpdateLoopNodes) {
                if (nodeUsesIdentifier(nonUpdateLoopNode, key)) {
                    count++;
                }
            }

            if (count === 1) {
                for (const updateNode of updateNodes) {
                    removeNodeFromAST(ast, updateNode);
                }

                let finalUsedNode;
                if (loopNode.type === NodeType.ForStatement) {
                    finalUsedNode = this.checkInit(loopNode.init, key);
                    loopNode.update = createUpdateExpressionNode('++', false, key);
                } else {
                    // Add update at final part of loop.
                    let newUpdateNode = createExpressionStatementNode(createUpdateExpressionNode('++', false, key));
                    loopNode.body.body.push(newUpdateNode);
                }
                if (finalUsedNode === undefined) {
                    // Check everything above loop for final use
                    finalUsedNode = getNodelastAssignedVariable(ast, key, loopNode);  
                }

                // finalUsedNode -> value[value.length - 1]
                this.fixFinalUsedNode(finalUsedNode, value[value.length - 1], ast, key);
                this.fixTestNode(loopNode, value[0] + 1, key);
            }
        }
        
    }
    
    fixTestNode(loopNode, smallerThanValue, name) {

        switch (loopNode.test.type) {
            case NodeType.BinaryExpression:
                loopNode.test = createBinaryExpressionNode(name, smallerThanValue, '<');
                break;
            case NodeType.LogicalExpression:
                let result = this.logicalExpressionTest(loopNode.test, name);
                if (result) {
                    loopNode.test = createLogicalExpressionNode(
                        createBinaryExpressionNode(name, smallerThanValue, '<'),
                        result,
                        '&&'
                    );
                } else {
                    loopNode.test = createBinaryExpressionNode(name, smallerThanValue, '<');
                }
        }
    }

    logicalExpressionTest(baseNode, name) {

        let leftResult;
        let rightResult;

        if (baseNode.left.type === NodeType.LogicalExpression) {
            leftResult = this.logicalExpressionTest(baseNode.left, name);
        } else {
            leftResult = this.keepBinaryExpression(baseNode.left, name);
        }
    
        if (baseNode.right.type === NodeType.LogicalExpression) {
            rightResult = this.logicalExpressionTest(baseNode.right, name);
        } else {
            rightResult = this.keepBinaryExpression(baseNode.right, name);
        }

        if (!leftResult && !rightResult) {
            return false;
        }
        if (!leftResult) {
            return rightResult;
        }
        if (!rightResult) {
            return leftResult;
        }

        return createLogicalExpressionNode(leftResult, rightResult, baseNode.operator);
    }

    keepBinaryExpression(binaryExpressionNode, name) {
        let keep = true;

        if (binaryExpressionNode.operator.includes(">") || binaryExpressionNode.operator.includes("<")) {
            if (binaryExpressionNode.left.name !== undefined && binaryExpressionNode.left.name === name) {
                keep = false; 
            }

            if (binaryExpressionNode.right.name !== undefined && binaryExpressionNode.right.name === name) {
                keep = false; 
            }
        }

        return keep ? binaryExpressionNode : false;
    }

    fillUpdateNode(forLoop) {
        forLoop.update = undefiend;
    }

    checkInit(initNode, indexName) {
        if (initNode === null) {
            return;
        }
        switch (initNode.type) {
            case NodeType.VariableDeclaration:
                for (const declaration of initNode.declarations) {
                    if (declaration.id.name === indexName) {
                        return declaration;
                    }
                }
                break;
            case NodeType.AssignmentExpression:
                if (initNode.left.name === indexName) {
                    return initNode;
                }
                break;
            case NodeType.UpdateExpression:
                if (initNode.argument.name === indexName) {
                    return initNode;
                }
                break;
            case NodeType.SequenceExpression:
                console.error("sequence expression in init node at reverseArrayWrite.mjs not implemented yet");
                break;
        }
    }

    fixFinalUsedNode(finalUsedNode, setToValue, ast, name) {

        switch (finalUsedNode.type) {
            case NodeType.VariableDeclarator:
                replaceNodeFromAST(ast, finalUsedNode, createVariableDeclaratorNode(name, setToValue));
                break;
            case NodeType.AssignmentExpression:
            case NodeType.UpdateExpression:
                replaceNodeFromAST(ast, finalUsedNode, createAssignmentExpressionNode(name, setToValue, '='));
                break;
            default:
                console.error("finalUsedNode is not correct node type in fixFinalUsedNode");
        }
    }



    findvariables(setMap) {
        let indexToLocations = new Map();
        let index;
        let arrayLocations = []
        for (const [key, value] of setMap.entries()) {

            if (index === undefined) {
                index = value;
            }

            if (index != value) {
                indexToLocations.set(index, arrayLocations);
                index = value;
                arrayLocations = [];
            }
            arrayLocations[arrayLocations.length] = key;
        }
        indexToLocations.set(index, arrayLocations);

        return indexToLocations;
    }

    filterReverseMap(reverseMap) {
        for (const [key, value] of reverseMap.entries()) {
            if (!isNaN(key) || value.length < 2) {
                reverseMap.delete(key);
            }
        }
        return reverseMap;
    }

    isEqualTo(reverseArrayWrite) {
        return this.name === reverseArrayWrite.name && compareMaps(this.setMap, reverseArrayWrite.setMap);
    }
    
}

function compareMaps(map1, map2) {
    var testVal;
    if (map1.size !== map2.size) {
        return false;
    }
    for (var [key, val] of map1) {
        testVal = map2.get(key);
        // in cases of an undefined value, make sure the key
        // actually exists on the object so there are no false positives
        if (testVal !== val || (testVal === undefined && !map2.has(key))) {
            return false;
        }
    }
    return true;
}