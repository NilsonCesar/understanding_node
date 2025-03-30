const { Readable } = require('node:stream');
const fs = require('node:fs');

class FileReadStream extends Readable {
  constructor({ highWaterMark, fileName }) {
    super({ highWaterMark });
    this.fileName = fileName;
    this.fd = null;
  }

  _construct(callback) {
    fs.open(this.fileName, 'r', (err, fd) => {
      if (err) callback(err);
      else {
        this.fd = fd;
        callback();
      }
    })
  }

  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.fd, buffer, 0, size, null, (err, bytesRead) => {
      if(err) return this.destroy(err);
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
    });
  }

  _destroy(error, callback) {
    if (this.fd) {
      fs.close(this.fd, err => {
        callback(err | error);
      });
    } else {
      callback(error);
    }
  }
}

const stream = new FileReadStream({highWaterMark: 1024, fileName: 'test.txt'});
stream.on('data', (chunk) => {
  console.log(chunk.toString());
})

stream.on('end', () => {
  console.log('strean finished');
})