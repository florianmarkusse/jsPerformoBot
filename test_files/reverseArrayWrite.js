/**
 * Test file for performance problem: "array write operations in reverse order".
 * Writing to a reverse in reverse order is slower than writing to an array in
 * natural order as the array has to be converted to a hashmap instead of a 
 * standard array.
 */

 // Reverse for-loop
 // Result should be the array write operations in natural order.
let arr = [];
let i = 10;
for (i = 2; i >= 0 && 10 > 3 && i < 10 &&  7 > 3; i--) {
    let k = 35;
    let j = k;
    arr[i] = 99;
    let f = k * j;
}

 // Reverse for-loop
 // Result should be the array write operations in natural order.
for (i = 30; i >= 15; i--) {
    arr[i] = 35;
}

 // Reverse while-loop
 // Result should be the array write operations in natural order.
let arr2 = [];
let j = 9;
while (j >= 0 && (5 % 2 == 1)) {
    arr2[j] = 99
    j--
}

 // Reverse do-while-loop
 // Result should be the array write operations in natural order.
let arr3 = [];
let k = 9;
do {
    arr3[k] = k;
    k--;
}
while (k >= 0 && 4 > 3 && true !== false)

// Reverse for-loop
// Result should be unchanged because index variable is used within loop for other uses as well.
let arr4 = [];
let arr5 = [];
for (let g = 10; g >= 0; g--) {
    arr4[g] = 35;
    arr5[0] = g * 20;
}

// Reverse for-loop enclosed in for-loop
// Result should be the array write operations in natural order.
let arr6 = [];
for (let ii = 0; ii < 1; ii++) {
    for (let jj = 10; jj >= 0; jj--) {
        arr6[jj] = ii;
    }
}