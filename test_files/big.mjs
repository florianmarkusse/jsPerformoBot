let c, f;
let arr = [];
let i = 10;
for (i = 2; i >= 0; i--) {
    arr[i] = 99;
    i += doThing();
}

function doThing() {
    return 3;
}