const fs = require('fs');

const key = fs.readFileSync('./key');
let keyOffset = 0;

function decrypt(ciphertext) {
    const plaintext = Buffer.alloc(ciphertext.length);

    for (let i = 0; i < plaintext.length; i++) {
        plaintext[i] = ciphertext[i] ^ key[i + keyOffset];
        key[i + keyOffset] = 0;
    }

    keyOffset += plaintext.length;
    return plaintext;
}

const message1Encrypted = Buffer.from('4293ddbdd782142acda028931347899baf1a461864e424828e8ded2d129bb60839771608a5ab', 'hex');
const plaintext = decrypt(message1Encrypted);

console.log(plaintext.toString('utf-8'));