
import espree from 'espree';
import fs from 'fs';
import pkg from 'estree-walker'; 
const {walk} = pkg;

fs.readFile('./example.js', function read(err, data) {
    if (err) {
        throw err;
    }
    const content = data;

    processFile(content); 
});

function processFile(content) {
    const ast = espree.parse(content, { tokens: false, ecmaVersion: 11 });
    
    
    walk( ast, {
        enter: function ( node, parent, prop, index ) {
            console.log(node);
            console.log(prop);
        },
        leave: function ( node, parent, prop, index ) {
            // some code happens
        }
    });
    

}




