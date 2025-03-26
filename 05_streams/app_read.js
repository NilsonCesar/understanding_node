const fs = require('node:fs/promises');

(async () => {
  console.time('readNumbers');
  const fileHandlerRead = await fs.open('test.txt', 'r');
  const fileHandlerWrite = await fs.open('dest.txt', 'w');

  const streamRead = fileHandlerRead.createReadStream();
  const streamWrite = fileHandlerWrite.createWriteStream();
  let split;
  
  streamRead.on('data', chunk => {
    const numbers = chunk.toString('utf-8').split('  ').map( number => number.trim());

    if (Number(numbers[0]) + 1 !== Number(numbers[1])) {
      if (split) numbers[0] = split + numbers[0];
    }
    
    if (Number(numbers[numbers.length - 2]) + 1 !== Number(numbers[numbers.length - 1])) {
      split = numbers.pop();
    }

    numbers.forEach( number => {
      number = Number(number);

      if (number % 2 == 0) {
        if(!streamWrite.write(' ' + number + ' ')) {
          streamRead.pause();
        }
      }
    })
  });

  streamWrite.on('drain', () => {
    streamRead.resume();
  });

  streamRead.on('end', () => {
     console.timeEnd('readNumbers');
  })
})()
