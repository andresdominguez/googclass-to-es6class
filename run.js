#! /usr/bin/env node
const fs = require('fs');
const babel = require('babel-core');
const googDefineClass = require('./goog-define-class');

// read the filename from the command line arguments
const fileName = process.argv[2];

// read the code from this file
const src = fs.readFileSync(fileName, 'utf8');

// use our plugin to transform the source
var out = babel.transform(src, {
  plugins: [googDefineClass]
});

// print the generated code to screen
console.log(out.code);
