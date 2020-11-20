'use strict';
var IteratorPrototype = require('./iterators-core').IteratorPrototype;
var create = require('./object-create');
var createPropertyDescriptor = require('./create-property-descriptor');
var setToStringTag = require('./set-to-string-tag');
var Iterators = require('./iterators');

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};
