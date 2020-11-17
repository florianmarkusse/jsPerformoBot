/**
 * Test file for performance problem: "undefined read on object".
 * Reading from an object's member which is not defined slows the 
 * program down and can just be replaced with 'undefined'.
 */

class Thing {
    constructor(bar) {
        this.foo = this.test;
    }
}