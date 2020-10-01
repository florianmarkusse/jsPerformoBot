let thing = [];
thing[0] = Number(4);
let set = new Set();
set.add(4);
switch (thing[0]) {
    case set.has(thing[0]):
        console.log("here1");
        thing = 30;
        break;
    case 1:
        console.log("here2");
        thing = 20;
        break;
    default:
        console.log("here3");
        thing = 10;
}

console.log(thing[0]);