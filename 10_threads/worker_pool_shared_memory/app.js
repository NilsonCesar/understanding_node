const Pool = require('./pool.js');
const { performance } = require('perf_hooks');

const numWorkers = 4;
const totalTasks = 20;
const count = 20;
const batchSize = 500;
const pool = new Pool(numWorkers, totalTasks * count);
let batchIndex = 0;
let result = [];
let tasksDone = 0;

const start = performance.now();

const submitBatch = (startIndex, endIndex) => {
    let batchTaskCount = 0;

    for (let i = startIndex; i < endIndex; i++) {
        batchTaskCount++;
        if (i % 2 === 0) {
            pool.submit('factorial', {
                n: i
            }, (factorial) => {
                console.log(performance.eventLoopUtilization());
                tasksDone++;
                batchTaskCount--;

                console.log(factorial);
                if (tasksDone === totalTasks) {
                    console.log(`Time taken: ${performance.now() - start}`);
                    process.exit(0);
                }

                if (batchTaskCount === 0) {
                    batchIndex++;
                    submitNextBatch();
                }
            });
        } else {
            pool.submit('generatePrimes', {
                start: 1000n + BigInt(i * 500),
                format: false,
                log: false
            }, (primes) => {
                console.log(performance.eventLoopUtilization());
                result = result.concat(primes);
                tasksDone++;
                batchTaskCount--;

                if (tasksDone === totalTasks) {
                    console.log(`Time taken: ${performance.now() - start}`);
                    console.log(pool.getPrimes());
                    process.exit(0);
                }

                if (batchTaskCount === 0) {
                    batchIndex++;
                    submitNextBatch();
                }
            });
        }
    }
}

const submitNextBatch = () => {
    if (batchIndex * batchSize >= totalTasks) return;
    const startIndex = batchIndex * batchSize;
    const endIndex = Math.min((batchIndex + 1) * batchSize, totalTasks);
    submitBatch(startIndex, endIndex);
}

submitNextBatch();