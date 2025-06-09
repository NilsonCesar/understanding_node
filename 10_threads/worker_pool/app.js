const Pool = require('./pool.js');
const { performance } = require('perf_hooks');

const numWorkers = 4;
const pool = new Pool(numWorkers);
const totalTasks = 2_0;
let result = [];
let tasksDone = 0;

const start = performance.now();
    
for (let i = 0; i < totalTasks; i++) {
    pool.submit('generatePrimes', {
        count: 200,
        start: 1_000_000,
        format: true,
        log: false
    }, (primes) => {
        result = result.concat(primes);
        tasksDone++;

        if (tasksDone === totalTasks) {
            console.log(`Time taken: ${performance.now() - start}`);
            console.log(result);
            process.exit(0);
        }
    });
}