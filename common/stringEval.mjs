export function unaryOperation(value, operator) {
    let string = typeof value !== 'string' ? String(value) : '"' + value + '"';
    return eval(value + operator);
}

export function binaryOperation(leftValue, operator, rightValue) {
    let leftString = typeof leftValue !== 'string' ? String(leftValue) : '"' + leftValue + '"';
    let rightString = typeof rightValue !== 'string' ? String(rightValue) : '"' + rightValue + '"';

    return eval(leftString + operator + rightString);
}
