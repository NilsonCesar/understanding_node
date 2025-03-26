const fs = require('node:fs/promises');

(async () => {
  const fileHandlerRead = await fs.open('test.txt', 'r');
  const fileHandlerWrite = await fs.open('dest.txt', 'w');

  const streamRead = fileHandlerRead.createReadStream();
  const streamWrite = fileHandlerWrite.createWriteStream();
  
  streamRead.on('data', chunk => {
    const numbers = chunk.toString('utf-8').split('  ');
    const buffer = Buffer.from((chunk.length).toString() + '\n');
    if(!streamWrite.write(buffer)) {
      streamRead.pause();
    }
  });

  streamWrite.on('drain', () => {
    streamRead.resume();
  });
})()
