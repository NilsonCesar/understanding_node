const fs = require('node:fs');
const path = require('node:path');
console.log(__dirname);
console.log(process.cwd());
require('./file.js');
const content = fs.readFileSync(path.join(__dirname + '/text.txt'), 'utf8');
console.log(content);
