import { NodeType } from '../node_types/nodeType.mjs';

export function createLiteralNode(value) {
    return {
        type: NodeType.Literal,
        start: 0,
        end: 0,
        value: value,
        raw: String(value),
    };
}

export function createIdentifierNode(name) {
    return {
        type: NodeType.Identifier,
        start: 0,
        end: 0,
        name: name,
    };
}

export function createAssignmentExpressionNode(name, value, op) {
    return {
        type: NodeType.AssignmentExpression,
        start: 0,
        end: 0,
        operator: op,
        left: createIdentifierNode(name),
        right: createLiteralNode(value),
    };
}

export function createVariableDeclaratorNode(name, value) {
    return {
        type: NodeType.VariableDeclarator,
        start: 0,
        end: 0,
        id: createIdentifierNode(name),
        init: createLiteralNode(value),
    }
}

export function createUpdateExpressionNode(op, pref, name) {
    return {
        type: NodeType.UpdateExpression,
        start: 0,
        end: 0,
        operator: op,
        prefix: pref,
        argument: createIdentifierNode(name),
    };
}

export function createBinaryExpressionNode(name, value, op) {
    return {
        type: NodeType.BinaryExpression,
        start: 0,
        end: 0,
        left: createIdentifierNode(name),
        operator: op,
        right: createLiteralNode(value),
    };
}

export function createLogicalExpressionNode(leftNode, rightNode, op) {
    return {
        type: NodeType.LogicalExpression,
        start: 0,
        end: 0,
        left: leftNode,
        operator: op,
        right: rightNode,
    }
}

export function createExpressionStatementNode(expressionNode) {
    return {
        type: NodeType.ExpressionStatement,
        start: 0,
        end: 0,
        expression: expressionNode,
    }
}

export function createCorrectNodeBasedOnValue(value) {
    if (value === undefined || isNaN(value)) {
        return createIdentifierNode(value);
    } else {
        return createLiteralNode(value);
    }
}

export function createCallExpressionNode() {
    return {
        type: NodeType.CallExpression,
        start: 0,
        end: 0,
        callee: null,
        arguments: [],
        optional: false
    }
}

export function createUnknownVariableDeclaratorNode(name) {
    return {
        type: NodeType.VariableDeclarator,
        start: 0,
        end: 0,
        id: createIdentifierNode(name),
        init: createCallExpressionNode(),
      }
}