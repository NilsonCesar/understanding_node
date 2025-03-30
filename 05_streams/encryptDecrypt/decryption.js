const fs = require('node:fs/promises')
const { Transform } = require('node:stream');

class Encrypt extends Transform {
    _transform(chunk, enconding, callback) {
        for (let i = 0; i < chunk.length; ++i) 
            chunk[i] = Math.max(chunk[i] - 1, 0);
        callback(null, chunk);
    }
}

(async () => {
    const readFileHandle = await fs.open('encrypted.txt', 'r');
    const writeFileHandle = await fs.open('decrypted.txt', 'w');

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    const decrypt = new Encrypt();

    readStream.pipe(decrypt).pipe(writeStream);
})()

