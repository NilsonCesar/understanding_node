const { spawn } = require('node:child_process');
const fs = require('node:fs');

const numberFormatter = spawn('number_formatter', ['./dest.txt', '$', ',']);

numberFormatter.stdout.on('data', data => {
  console.log(data.toString());
});

numberFormatter.stderr.on('data', data => {
  console.log(`stderr: ${data.toString()}`);
});

numberFormatter.on('close', code => {
  if (!code) {
    console.log('The file was read, processed and written successfully');
  } else {
    console.log('Something bad happened!');
  }
});

const fileStream = fs.createReadStream('./src.txt');
fileStream.pipe(numberFormatter.stdin);
