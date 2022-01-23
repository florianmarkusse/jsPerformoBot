var DESCRIPTORS = require('./descriptors');
var definePropertyModule = require('./object-define-property');
var createPropertyDescriptor = require('./create-property-descriptor');

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};
