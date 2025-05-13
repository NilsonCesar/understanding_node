const { spawn, exec } = require('node:child_process');
const { stdin, stdout, stderr } = require('node:process');

const childProcess = spawn(
  './playground',
  ['some string', '-f', '189', 189, '-flag'],
  {
    env: { MODE: 'just playing!' },
  }
)

childProcess.stdout.on('data', data => {
  console.log(data.toString());
});

childProcess.stderr.on('data', data => {
  console.log('From stderr:', data.toString());
});

childProcess.stdin.write('Hello from node!');
childProcess.stdin.end();

// console.log(process.argv);

// const subprocess = spawn('ls', ['-alF']);

// subprocess.stdout.on('data', (data) => {
//   console.log(data.toString());
//   console.log();
// });

// exec("echo 'something string' | tr ' ' '\n' ", (err, stdout, stderr) => {
//   if (err) {
//     console.log(err);
//     return;
//   }

//   console.log(stdout);
//   console.log('stderr: ' + stderr);
// });

// console.log(process.env.PATH);

// // 0
// stdin.on('data', data => {
//   // console.log('From stdin:', data.toString());
//   // same as:
//   stdout.write('From stdin: ' + data.toString());
// });
// // 1
// stdout.write('Hello out!\n');
// // 2
// stderr.write('OMG, an (may?) error!\n');