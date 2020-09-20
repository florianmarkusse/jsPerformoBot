import lodash from 'lodash';

import { getUpdateNodesInLoop } from '../ast_utilities/astTraversal.mjs';
import { getNodelastAssignedVariable } from '../ast_utilities/astTraversal.mjs';
import { removeNodeFromAST } from '../ast_utilities/astTraversal.mjs';
import { replaceNodeFromAST } from '../ast_utilities/astTraversal.mjs';
import { getASTUntil } from '../ast_utilities/astTraversal.mjs';
import { getFirstLoopNodeArrayWrittenTo } from '../ast_utilities/astTraversal.mjs';
import { createUpdateExpressionNode } from '../ast_utilities/nodes.mjs';
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
        this.reverseMap = this.findvariables(this.setMap);
        this.filterReverseMap();
        for (const [key, value] of this.reverseMap) {
            let loopNode = getFirstLoopNodeArrayWrittenTo(ast, this.name, key);
            //console.log(result);
            let updateNodes = getUpdateNodesInLoop(loopNode.update, key);
            updateNodes.concat(getUpdateNodesInLoop(loopNode.body, key));

            for (const updateNode of updateNodes) {
                removeNodeFromAST(ast, updateNode);
            }

            let finalUsedNode;
            if (loopNode.type === NodeType.ForStatement) {
                finalUsedNode = this.checkInit(loopNode.init, key);
                loopNode.update = createUpdateExpressionNode('++', false, key);
            } else {

            }
            if (finalUsedNode === undefined) {
                // Check everything above loop for final use
                let copyAST = lodash.cloneDeep(ast);
                let ASTUntilLoop = getASTUntil(copyAST, loopNode);

                finalUsedNode = getNodelastAssignedVariable(ASTUntilLoop, key);   
            }

            // finalUsedNode -> value[value.length - 1]
            this.fixFinalUsedNode(finalUsedNode, value[value.length - 1], ast, key);
            this.fixTestNode(loopNode, value[0] + 1, key);
        }
        
    }
    
    fixTestNode(loopNode, smallerThanValue, name) {

        switch (loopNode.test.type) {
            case NodeType.BinaryExpression:
                loopNode.test = createBinaryExpressionNode(name, smallerThanValue, '<');
                break;
            case NodeType.LogicalExpression:
                this.logicalExpressionTest(loopNode.test, name);
        }
    }

    logicalExpressionTest(testNode, name) {

        let leftResult;
        let rightResult;

        if (testNode.type === NodeType.LogicalExpression) {
            leftResult = logicalExpressionTest(testNode.left, name);
        } else {
            leftResult = keepBinaryExpression(baseNode.left, name);
        }
    
        if (testNode.type === NodeType.LogicalExpression) {
            rightResult = logicalExpressionTest(testNode.right, name);
        } else {
            rightResult = keepBinaryExpression(baseNode.right, name);
        }

        // DO LOGICAL EXPRESSION REMOVAL OF ALL NODES WITH INDEX

    }

    keepBinaryExpression(binaryExpressionNode, name) {
        let keep = true;

        if (binaryExpressionNode.left.name !== undefined && binaryExpressionNode.left.name === name) {
                keep = true; 
        }

        if (binaryExpressionNode.right.name !== undefined && binaryExpressionNode.right.name === name) {
            keep = true; 
        }

        return keep;
    }

    fillUpdateNode(forLoop) {
        forLoop.update = undefiend;
    }

    checkInit(initNode, indexName) {
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
                console.error("sequence expression in init node at reverseArratWrite.mjs not implemented yet");
                break;
        }
    }

    fixFinalUsedNode(finalUsedNode, setToValue, ast, name) {

        console.log(finalUsedNode);

        switch (finalUsedNode.type) {
            case NodeType.VariableDeclarator:
                finalUsedNode.init = createLiteralNode(setToValue);
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

    filterReverseMap() {
        for (const [key, value] of this.reverseMap.entries()) {
            if (!isNaN(key) || value.length < 2) {
                this.reverseMap.delete(key);
            }
        }
    }

    
}