"use strict";

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addToFixSet = addToFixSet;
exports.deleteFromFixSet = deleteFromFixSet;
exports.getFixSet = getFixSet;
exports.clearFixSet = clearFixSet;
exports.addToUnfixableSet = addToUnfixableSet;
exports.containsInUnfixableSet = containsInUnfixableSet;
let fixSet = new Set();
let unFixableSet = new Set();

function addToFixSet(element) {
  fixSet.add(element);
}

function deleteFromFixSet(element) {
  fixSet.delete(element);
}

function getFixSet() {
  return fixSet;
}

function clearFixSet() {
  fixSet = new Set();
}

function addToUnfixableSet(element) {
  unFixableSet.add(element);
}

function containsInUnfixableSet(element) {
  return unFixableSet.has(element);
}