const { workerData, threadId } = require('worker_threads');

const numberBuffer = new Uint32Array(workerData.number);
const seal = new Uint8Array(workerData.seal);

for (let i = 0; i < 500; i++) {
    // Critical section
    
    while(Atomics.compareExchange(seal, 0, 0, 1) === 1) {}
    
    numberBuffer[0] += 1;

    Atomics.store(seal, 0, 0);
}