const { workerData, parentPort } = require("worker_threads");
const crypto = require("crypto");

const BATCH_SIZE = 100000;
const buffer = Buffer.alloc(BATCH_SIZE);

function fillBuffer() {
    crypto.randomFillSync(buffer);
}

function readRandomNumber(offset) {
    // offset is like index, but it relates to bytes
    const number = buffer.readUint16BE(offset);
    return number;
}

let offset = 0;
let sum = 0;
let random;

fillBuffer();

for (let i = 0; i < workerData.count; i++) {
  random = readRandomNumber(offset);
  offset += 2;
  sum += random;

  if (offset === BATCH_SIZE) {
    fillBuffer();
    offset = 0;
  }

  if (sum > 100_000_000) {
    sum = 0;
  }
}

parentPort.postMessage(sum);
