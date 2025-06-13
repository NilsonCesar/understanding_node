const buf1 = Buffer.from('Hey, Link, listen!');
const buf2 = new Uint8Array(16);
const buf3 = Buffer.from('Hey, ueppaa');

buf2[2] = 40;

// console.log(buf1.buffer);
// console.log(buf1.byteOffset);
// console.log(buf3.buffer);
// console.log(buf3.byteOffset);
// console.log(buf2);

const rawBuf = new ArrayBuffer(20);
// const viewBuf = Buffer.from(rawBuf);
const viewBuf = new Uint8Array(rawBuf);
viewBuf[2] = 43;

rawBuf[2] = 43;
console.log(rawBuf);

const bufA = Buffer.from('First portion. ', 'utf-8');
const bufB = Buffer.from('Second portion', 'utf-8');
const combined = Buffer.concat([bufA, bufB]);

console.log(combined.buffer);
console.log(combined.toString('utf-8'));

