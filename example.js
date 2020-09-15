// Bitwise or with undefined => result should be y = 2.
var x, y, rep = 300;//300000000;
for (var i = 0; i < rep; i++) {
   y = x | 2;
}

// Addition operator on undefined variable and array variable. Both should be cast to string
// => result should be 'undefined1,2,43'
let array = [1, 2, 43];
let string = x + array;

// Division operator on object variable and undefined variable.
// => result should be NaN.
let object = {x: {f: "hello"}};
let nanresult = object.x / undefined;

// Subtraction operator on object variable and undefined variable. 
// => result should be NaN.
let j = 0;
while (j < 10) {
   let whileResult = object - x;
   j++;
}

// Multiplication operator on literal variable and undefined variable. 
// => result should be NaN.
do {
   let doWhileResult = "helllo" * x;
} while (false)

// Modulus operator on undefined and string variable.
// => result should be NaN.
let moduloResult = undefined % "hello";