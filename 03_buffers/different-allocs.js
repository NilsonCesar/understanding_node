const { Buffer } = require('buffer');

const buffer = Buffer.alloc(10000, 0);

const bufferUnsafe = Buffer.allocUnsafe(100);
// bufferUnsafe.fill(0);

console.log(bufferUnsafe);
