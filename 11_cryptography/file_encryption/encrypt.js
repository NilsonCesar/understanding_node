const fs = require('node:fs');
const crypto = require('node:crypto');
const { pipeline } = require('node:stream');

const password = process.env.FE_PASSWORD || 'completly secure password';
const algorithm = 'aes-256-gcm';

const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);

crypto.pbkdf2(password, salt, 1_000_000, 32, 'sha512', (err, derivedKey) => {
    if (err) console.error(err);


    /**
     * Encrypted body packet
     * First 16 bytes: salt
     * Second 16 bytes: iv
     * Middle: ciphertext
     * Last 16 bytes: authCode
    */

    const cipher = crypto.createCipheriv(algorithm, derivedKey, iv);

    const plaintext = fs.createReadStream('./data.txt');
    const packet = fs.createWriteStream('./data.enc');

    packet.write(salt);
    packet.write(iv);

    pipeline(plaintext, cipher, packet, (err) => {
        if (err) return console.error(err);
        const authCode = cipher.getAuthTag();
        fs.appendFileSync('./data.enc', authCode);
        console.log('Salt:', salt.toString('hex'));
        console.log('Iv:', iv.toString('hex'));
        console.log('AuthCode:', authCode.toString('hex'));
        console.log('Encryption completed and authentication tag written.');
    });
});