const { Duplex } = require('node:stream');
const fs = require('node:fs');

class DuplexStream extends Duplex {
  constructor({writableHighWaterMark, readableHighWaterMark, writeFileName, readFileName}) {
    super({ writableHighWaterMark, readableHighWaterMark });
    this.writeFileName = writeFileName;
    this.readFileName = readFileName;
    this.writeFd = null;
    this.readFd = null;
    this.chunks = [];
    this.chunksSize = 0;
  }

  _construct(callback) {
    fs.open(this.writeFileName, 'w', (err, writeFd) => {
      if (err) return callback(err);
      else {
        this.writeFd = writeFd;
        fs.open(this.readFileName, 'r', (err, readFd) => {
          if (err) return callback(err);
          this.readFd = readFd;
          callback();
        })
      }
    })
  }

  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunksSize += chunk.length;
    if (this.chunksSize > this.writableHighWaterMark) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), err => {
        if (err) return callback(err);
        this.chunks = [];
        this.chunksSize = 0;
        callback();
      });
    } else {
      callback();
    }
  }

  _read(size) {
    const buffer = Buffer.alloc(size);
    fs.read(this.readFd, buffer, 0, size, null, (err, bytesRead) => {
      if (err) return this.destroy(err);
      this.push(bytesRead > 0 ? buffer.subarray(0, bytesRead) : null);
    });
  }

  _final(callback) {
    if (this.chunks.length > 0) {
      fs.write(this.writeFd, Buffer.concat(this.chunks), err => {
        if (err) return callback(err);
        this.chunks = [];
        this.chunksSize = 0;
        callback();
      })
    } else {
      callback();
    }
  }

  _destroy(error, callback) {
    callback(error);
  }
}

const stream = new DuplexStream({writableHighWaterMark: 1024, readableHighWaterMark: 1024, writeFileName: 'write.txt', readFileName: 'test.txt'});

stream.write(Buffer.from('Hello World\n'));
stream.end(Buffer.from('Bye World'));