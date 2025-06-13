const { workerData, threadId } = require('worker_threads');

const numberBuffer = new Uint32Array(workerData.number);

for (let i = 0; i < 500; i++) {
    // Critical section
    
    Atomics.add(numberBuffer, 0, 1);
    
    // numberBuffer[0] += 1;
}