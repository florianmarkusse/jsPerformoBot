let thing = Array.of(3);
let arr = {k : 3};

if (thing) {
    if (false) {
        arr.k += 10;
    } else {
        arr.k += 13; 
    }
} else {
    arr.k = 35;
}