/**
 * Test file for performance problem: "undefined read on object".
 * Reading from an object's member which is not defined slows the 
 * program down and can just be replaced with 'undefined'.
 */


let arr = [];

// Reading from an undefined array element.
// Result should be undefined.
let k = arr[3];

let obj = {};

// Reading from an undefined object member.
// Result should be undefined.
let j = obj.k;

let obj2 = {g: 33, j: {}};

// Reading from an undefined object member.
// Result should be undefined.
let f = obj2.j.r;

// Reading from an undefined array element.
// Result should be undefined.
for (let i = 0; i < 10; i++) {
    let h = arr[i];
}

// Reading from an undefined array element.
// Result should be undefined which in turn results in the result being just 5.
// See binaryOperationUndefined.js for more information.
let b = arr[i] | 5;