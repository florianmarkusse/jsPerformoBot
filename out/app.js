"use strict";

require("../core-js/modules/es.array.reverse");

require("../core-js/modules/es.string.ends-with");

require("../core-js/modules/es.string.includes");

require("../core-js/modules/es.string.replace");

require("../core-js/modules/es.string.split");

require("../core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseAST = getBaseAST;
exports.gitHubAction = gitHubAction;

var _fs = _interopRequireDefault(require("fs"));

var _espree = _interopRequireDefault(require("espree"));

var _escodegen = _interopRequireDefault(require("escodegen"));

var _lodash = _interopRequireDefault(require("lodash"));

var _nodeType = require("./node_types/nodeType.js");

var _variable = require("./types/variable.js");

var _fix = require("./fixes/fix.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fileStringsToCheck = [];
let filesFixed = [];
let deepCopyAST;
let batchMode = true;
let inputDirectory;
let outputDirectory;
let procVarLength = process.argv.length;

for (let i = 0; i < procVarLength; i++) {
  console.log(String(process.argv[i]));
}

if (String(process.argv[2]).endsWith(".js") || String(process.argv[2]).endsWith(".mjs")) {
  fileStringsToCheck[0] = './test_files/' + String(process.argv[2]);
  batchMode = false;
} else {
  // Batch mode
  if (process.argv.length != 4) {
    console.log("Specify input directory and output directory, e.g.: npm run bar C:\\testositories C:\\incorrectFiles");
    throw Error();
  } else {
    inputDirectory = String(process.argv[2]) + "\\";
    outputDirectory = String(process.argv[3]) + "\\";
  }

  let result = getAllFilesRecursively(inputDirectory);
  fileStringsToCheck = getOnlyJSFiles(result);
}

for (let i = 0; i < fileStringsToCheck.length; i++) {
  const fileString = fileStringsToCheck[i];

  if (fileString.includes('.min')) {
    continue;
  }

  console.log("Reading file ".concat(fileString));

  let data = _fs.default.readFileSync(fileString, function read(err, data) {
    if (err) {
      throw err;
    }
  });

  let ast;

  try {
    ast = _espree.default.parse(data, {
      tokens: false,
      ecmaVersion: 11,
      sourceType: "module"
    });
  } catch (err) {
    continue;
  }

  deepCopyAST = _lodash.default.cloneDeep(ast);
  let previousFix;
  let fixToDo;
  let foundFix = false;
  let fixesApplied = [];

  do {
    // The processing happens here
    processAST(ast);
    let iterator = (0, _fix.getFixSet)().values();
    fixToDo = iterator.next().value;

    while (previousFix !== undefined && fixToDo !== undefined && fixToDo.isEqualTo(previousFix) || (0, _fix.containsInUnfixableSet)(fixToDo)) {
      (0, _fix.addToUnfixableSet)(fixToDo);
      fixToDo = iterator.next().value;
    }

    if (fixToDo !== undefined) {
      fixToDo.fix(ast);

      if (!_lodash.default.isEqual(ast, deepCopyAST)) {
        foundFix = true;
        fixesApplied.push(fixToDo);
      }

      ast = _espree.default.parse(_escodegen.default.generate(ast), {
        tokens: false,
        ecmaVersion: 11,
        sourceType: "module"
      });
      previousFix = fixToDo;
    }
  } while (fixToDo !== undefined
  /*false*/
  );

  if (foundFix) {
    fixesApplied.forEach(fix => {
      console.log(fix);
    });
    filesFixed.push(fileString);

    if (batchMode) {
      batchWrite(fileString, data, ast);
    } else {
      testWrite(ast);
    }
  }
}

function processAST(ast) {
  clearGlobals();
  (0, _nodeType.processASTNode)(ast);
  /*
  getVariables()[0].forEach(element => {
      console.log(element);
  });
  
  
  getFixSet().forEach(fix => {
      console.log(fix);
      console.log(fix.nodeToChange);
  })
  */

  return ast;
}

function clearGlobals() {
  (0, _variable.clearVariablesMap)();
  (0, _fix.clearFixSet)();
}

function getAllFilesRecursively(fileName) {
  let fileNames = _fs.default.readdirSync(fileName);

  for (let i = 0; i < fileNames.length; i++) {
    if (_fs.default.lstatSync(fileName + "\\" + fileNames[i]).isDirectory()) {
      fileNames[i] = getAllFilesRecursively(fileName + "\\" + fileNames[i]);
      i += fileNames[i].length - 1;
      fileNames = flatten(fileNames);
    } else {
      fileNames[i] = fileName + "\\" + fileNames[i];
    }
  }

  return fileNames;
}

function flatten(input) {
  const stack = [...input];
  const res = [];

  while (stack.length) {
    // pop value from stack
    const next = stack.pop();

    if (Array.isArray(next)) {
      // push back array items, won't modify the original input
      stack.push(...next);
    } else {
      res.push(next);
    }
  } // reverse to restore input order


  return res.reverse();
}

function getOnlyJSFiles(files) {
  let jsFiles = [];
  files.forEach(file => {
    if (file.endsWith(".js") || file.endsWith(".mjs")) {
      jsFiles.push(file);
    }
  });
  return jsFiles;
}

function batchWrite(fileString, data, ast) {
  let split = fileString.replace(inputDirectory, '').split("\\");
  let pathBuilder = outputDirectory;
  let fixedPath;

  for (let i = 0; i < split.length; i++) {
    if (i < split.length - 1) {
      pathBuilder += "\\" + split[i];

      if (!_fs.default.existsSync(pathBuilder)) {
        _fs.default.mkdirSync(pathBuilder);
      }
    } else {
      fixedPath = pathBuilder + "\\\\FIXED_" + split[i];
      pathBuilder += "\\\\" + split[i];
    }
  }

  _fs.default.writeFileSync(pathBuilder, data, err => {
    if (err) {
      console.log(err);
    }
  });

  _fs.default.writeFileSync(fixedPath, _escodegen.default.generate(ast), err => {
    if (err) {
      console.log(err);
    }
  });
}

function testWrite(ast) {
  _fs.default.writeFileSync(".\\results\\test_fixed.mjs", _escodegen.default.generate(ast), err => {
    if (err) {
      console.log(err);
    }
  });
}

function getBaseAST() {
  return deepCopyAST;
}

function gitHubAction() {
  console.log("hello");
}