const { Worker, MessageChannel } = require('worker_threads');
const count = 10;
const startingNumber = 100;
const nThreads = 2;
let completed = 0;
let primeNumbers = [];

for (let i = 0; i < nThreads; i++) {
    const worker = new Worker('./calc', { workerData:
        { count: count / nThreads, startingNumber: startingNumber + 10 * i }
    });
    console.log(`Worker ${i + 1} initiated...`);
    
    worker.on('message', msg => {
        primeNumbers = primeNumbers.concat(msg);
    });

    worker.on('error', err => {
        console.error(err);
    });

    worker.on('exit', code => {
        completed++;
        console.log(completed);

        if (code !== 0) {
            console.error(`Worker thread ${worker.threadId} finished with code ${code}`);
        }

        if (completed === nThreads) {
            console.log(primeNumbers);
        }
    });
}

while (true) {
    if (completed !== nThreads) break;
}