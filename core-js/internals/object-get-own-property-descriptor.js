
var DESCRIPTORS = require('./descriptors');
var propertyIsEnumerableModule = require('./object-property-is-enumerable');
var createPropertyDescriptor = require('./create-property-descriptor');
var toIndexedObject = require('./to-indexed-object');
var toPrimitive = require('./to-primitive');
var has = require('./has');
var IE8_DOM_DEFINE = require('./ie8-dom-define');

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};
