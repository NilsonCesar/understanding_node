const crypto = require('crypto');

const key = Buffer.from('abcdefghijklmnop');

const plaintext = Buffer.from('Hey, Link, Listen!');

const cipher = crypto.createCipheriv('aes-128-ecb', key, null);

const cipherChunk1 = cipher.update(plaintext);
const cipherChunk2 = cipher.final();

const ciphertext = Buffer.concat([cipherChunk1, cipherChunk2]);

console.log(ciphertext.toString('hex'));