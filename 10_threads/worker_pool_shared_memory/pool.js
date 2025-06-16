const { Worker, workerData } = require('worker_threads');

class Pool {
    constructor(threadCount, totalItemsCount) {
        this.threadCount = threadCount;
        this.threads = [];
        this.idleThreads = [];
        this.scheduledTasks = [];
        this.primes = new SharedArrayBuffer(totalItemsCount * 8);
        this.primesSeal = new SharedArrayBuffer(8);

        for (let i = 0; i < threadCount; i++) {
            this.spawnThread();
        }
    }

    spawnThread() {
        const worker = new Worker('./calc.js', {workerData: { primes: this.primes, primesSeal: this.primesSeal }});

        worker.on('message', (result) => {
            const { callback } = worker.currentTask;

            if (callback) {
                callback(result);
            }

            this.idleThreads.push(worker);
            this.runNextTask();
        });

        this.threads.push(worker);
        this.idleThreads.push(worker);
    }

    runNextTask() {
        if (!this.scheduledTasks.length || !this.idleThreads.length) return;

        const worker = this.idleThreads.shift();
        const { taskName, options, callback } = this.scheduledTasks.shift();

        worker.currentTask = { taskName, options, callback };
        worker.postMessage({ taskName, options });
    }

    submit(taskName, options, callback) {
        this.scheduledTasks.push({taskName, options, callback});
        this.runNextTask();
    }

    getPrimes() {
        return Array.from(new BigUint64Array(this.primes)).sort();
    }
}

module.exports = Pool;