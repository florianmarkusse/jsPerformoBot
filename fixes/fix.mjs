let fixSet = new Set();

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