const fs = require('fs');

const key = fs.readFileSync('./key');
let keyOffset = 0;

function encrypt(plaintext) {
    const ciphertext = Buffer.alloc(plaintext.length);

    for (let i = 0; i < plaintext.length; i++) {
        ciphertext[i] = plaintext[i] ^ key[i + keyOffset];
        key[i + keyOffset] = 0; 
    }

    keyOffset += plaintext.length;
    return ciphertext;
}

const message1 = Buffer.from('Commander Hendrick: Hey, Link, listen!');

const message1Encrypted = encrypt(message1);

console.log(message1Encrypted);