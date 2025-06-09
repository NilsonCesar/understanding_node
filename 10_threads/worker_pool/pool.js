const { Worker, workerData } = require('worker_threads');

class Pool {
    constructor(threadCount) {
        this.threadCount = threadCount;
        this.threads = [];
        this.idleThreads = [];
        this.scheduledTasks = [];

        for (let i = 0; i < threadCount; i++) {
            this.spawnThread();
        }
    }

    spawnThread() {
        const worker = new Worker('./calc.js');

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
}

module.exports = Pool;