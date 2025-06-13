const { workerData, threadId } = require('worker_threads');

const numberBuffer = new Uint32Array(workerData.number);

for (let i = 0; i < 500; i++) {
    // Critical section
    numberBuffer[0] += 1;
}