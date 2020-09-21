let fixSet = new Set();
let unFixableSet = new Set();

export function addToFixSet(element) {
    fixSet.add(element)
}

export function deleteFromFixSet(element) {
    fixSet.delete(element);
}

export function getFixSet() {
    return fixSet;
}

export function clearFixSet() {
    fixSet.clear();
}

export function addToUnfixableSet(element) {
    unFixableSet.add(element);
}

export function containsInUnfixableSet(element) {
    return unFixableSet.has(element);
}