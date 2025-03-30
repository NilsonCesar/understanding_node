const { Writable } = require('node:stream');
const fs = require('node:fs');
const { callbackify } = require('node:util');

class FileWritableStream extends Writable {
  constructor({ highWaterMark, fileName }) {
    super(highWaterMark);

    this.fileName = fileName;
    this.fd = null;
    this.chunks = [];
    this.chunksSize = 0;
    this.writesCount = 0;
  }

  _construct(callback) {
    fs.open(this.fileName, 'w', (err, fd) => {
      if (err) callback(err);
      else {
        this.fd = fd;
        callback();
      }
    })
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;
    
    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.fd, Buffer.concat(this.chunks), err => {
        if(err) return callback(err);

        this.chunks = [];
        this.chunksSize = 0;
        ++this.writesCount;
        callback();
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    if (this.chunks.length > 0) {
      fs.write(this.fd, Buffer.concat(this.chunks), err => {
        if (err) return err;
        this.chunks = [];
        this.chunksSize = 0;
        ++this.writesCount;
        callback();
      })
    }
  }

  _destroy(error, callback) {
    console.log('Number of writes:', this.writesCount);

    if (this.fd) {
      fs.close(this.fd, err => {
        callback(err | error);
      });
    } else {
      callback(error);
    }
  }
}

const stream = new FileWritableStream({highWaterMark: 1024, fileName: 'test.txt'});
stream.write(Buffer.from('Hello World\n'));
stream.end(Buffer.from('Bye World'));

stream.on('finish', () => {
  console.log('strean finished');
})