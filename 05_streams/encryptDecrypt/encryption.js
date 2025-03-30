const fs = require('node:fs/promises')
const { Transform } = require('node:stream');

class Encrypt extends Transform {
    _transform(chunk, enconding, callback) {
        for (let i = 0; i < chunk.length; ++i)
            chunk[i] = Math.min(chunk[i] + 1, 255);
        callback(null, chunk);
    }
}

(async () => {
    const readFileHandle = await fs.open('read.txt', 'r');
    const writeFileHandle = await fs.open('encrypted.txt', 'w');

    const readStream = readFileHandle.createReadStream();
    const writeStream = writeFileHandle.createWriteStream();

    const encrypt = new Encrypt();

    readStream.pipe(encrypt).pipe(writeStream);
})()

