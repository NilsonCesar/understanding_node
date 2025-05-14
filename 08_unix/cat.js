const { stdin, stdout, stderr, argv, exit } = require('node:process');
const fs = require('node:fs');

for (let i = 2; i < argv.length; i++) {
  console.log('here', argv[i]);
  const filePath = argv[i];
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(stdout);

  if (i === argv.length - 1) {
    fileStream.on('end', () => {
      stdout.write('\n');
      exit(0);
    });
  }
}

stdin.on('data', data => {
  stdout.write(data.toString());
});
