

export function contiguityWarning(assignmentNode, arrayVariable, index, contiguityResult) {

    assignmentNode.left.property.value = arrayVariable.elements.length;
    assignmentNode.left.property.raw = String(arrayVariable.elements.length);

    return true;
}