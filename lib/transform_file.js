var pluginRunner = require('./plugin_runner');

// read the filename from the command line arguments
const fileName = process.argv[2];
const out = pluginRunner.run(fileName);
console.log(out);
