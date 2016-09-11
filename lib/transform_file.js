const fs = require('fs');
const pluginRunner = require('./plugin_runner');
const program = require('commander');

program
    .version(require('../package.json').version)
    .usage('[options] <file> [output-file]')
    .option('-i --inline', 'Do inline replacement')
    .parse(process.argv);

// No input?
if (program.args.length === 0) {
  console.log('Please enter an input file');
  return console.log(program.helpInformation());
}

// Did you provide output file and -i flag?
if (program.args.length > 1 && program.inline) {
  console.log('Error: inline requires one argument only');
  return console.log(program.helpInformation());
}

// Transform input.
const fileName = program.args[0];
const out = pluginRunner.run(fileName);

// Output.
if (program.inline) {
  // Write to the same file.
  fs.writeFileSync(fileName, out);
} else if (program.args.length === 2) {
  // Write to another file.
  const outputFile = program.args[1];
  fs.writeFileSync(outputFile, out);
} else {
  // To stdout.
  console.log(out);
}
