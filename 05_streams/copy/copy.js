const { pipeline } = require('node:stream');
const fs = require('node:fs/promises');  

// (async () => {
//   const fileHandlerRead = await fs.open('test.txt', 'r');
//   const fileHandlerWrite = await fs.open('dest.txt', 'w');
//   let bytesRead;
  
//   do {
//     let readResult = await fileHandlerRead.read();
//     bytesRead = readResult.bytesRead;
//     if (bytesRead !== 16384) {
//       const indexOfFirstZero = readResult.buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfFirstZero);
//       readResult.buffer.copy(newBuffer, 0, 0, indexOfFirstZero);
//       fileHandlerWrite.write(newBuffer);
//     } else {
//       fileHandlerWrite.write(readResult.buffer);
//     }
//   } while (bytesRead > 0);
// })()

(async () => {
  console.time('writingNumbers');
  const fileHandlerRead = await fs.open('test.txt', 'r');
  const fileHandlerWrite = await fs.open('dest.txt', 'w');
  
  const readStream = fileHandlerRead.createReadStream();
  const writeStream = fileHandlerWrite.createWriteStream();

  // readStream.pipe(writeStream);

  // readStream.unpipe(writeStream);

  // readStream.on('end', () => {
  //   console.timeEnd('writingNumbers');
  // })

  pipeline(readStream, writeStream, err => {
    console.log(err);
    console.timeEnd('writingNumbers');
  });
})()
