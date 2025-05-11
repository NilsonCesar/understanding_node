const { spawn, exec } = require('node:child_process');

console.log(process.argv);

const subprocess = spawn('ls', ['-alF']);

subprocess.stdout.on('data', (data) => {
  console.log(data.toString());
  console.log();
});

exec("echo 'something string' | tr ' ' '\n' ", (err, stdout, stderr) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log(stdout);
  console.log('stderr: ' + stderr);
});

console.log(process.env.PATH);
