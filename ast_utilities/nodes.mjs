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
    }
}
