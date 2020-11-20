let string =  "refs/heads/main"

let result = string.split("/");
console.log(result);

let newString = "";
for (let i = 2; i < result.length; i++) {
    newString += result[i];
}

console.log(newString);