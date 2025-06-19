const crypto = require('crypto');
const fs = require('fs');

const key = crypto.randomBytes(100);
fs.writeFileSync('./key', key);