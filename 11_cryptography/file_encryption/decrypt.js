const fs = require('node:fs');
const crypto = require('node:crypto');
const { pipeline } = require('node:stream');

const password = process.env.FE_PASSWORD || 'completly secure password';

const algorithm = 'aes-256-gcm';
const fd = fs.openSync('./data.enc', 'r');
const fileSize = fs.fstatSync(fd).size;

const salt = Buffer.alloc(16);
const iv = Buffer.alloc(12);
const authCode = Buffer.alloc(16);

fs.readSync(fd, salt, 0, 16, 0);
fs.readSync(fd, iv, 0, 12, 16);
fs.readSync(fd, authCode, 0, 16, fileSize - 16);

console.log('Salt:', salt.toString('hex'));
console.log('Iv:', iv.toString('hex'));
console.log('AuthCode:', authCode.toString('hex'));

crypto.pbkdf2(password, salt, 1_000_000, 32, 'sha512', (err, key) => {
	if (err) return console.error(err);

	const cipher = crypto.createDecipheriv(algorithm, key, iv);

	cipher.setAuthTag(authCode);

	const input = fs.createReadStream('./data.enc', {
		start: 28,
		end: fileSize - (16 + 1),
	});

	const plaintext = fs.createWriteStream('data_decrypted.txt');

	pipeline(input, cipher, plaintext, (err) => {
		if (err) return console.error(err);

		console.log('Decryption completed, and authentication verified!');
	});
});