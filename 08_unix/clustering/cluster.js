const cluster = require('node:cluster');

if (cluster.isPrimary) {
  const coreCount = require('node:os').availableParallelism();
  for (let i = 0; i < coreCount; i++) {
    const worker = cluster.fork();
    worker.send('I am your father!');
    console.log('Spawn a new child process with PID: ' + worker.process.pid);
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(worker.process.pid, code, signal);
    const newWorker = cluster.fork();
    console.log('Restarting worker with PID: ' + worker.process.pid + ' with PID: ' + newWorker.process.pid);
  });

  cluster.on('message', (worker, message) => {
    console.log('Worker', worker.process.pid, 'send the message:', message);
  });
} else {
  require('./server.js');
}
