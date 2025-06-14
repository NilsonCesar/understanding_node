const { workerData, threadId } = require('worker_threads');

const numberBuffer = new Uint32Array(workerData.number);
const seal = new Int32Array(workerData.seal);

const lock = (seal) => {
    while (Atomics.compareExchange(seal, 0, 0, 1)) {
        Atomics.wait(seal, 0, 1);
    }
}

const unlock = (seal) => {
    Atomics.store(seal, 0, 0);
    Atomics.notify(seal, 0, 1);
    Atomics.add(seal, 1, 1);
}

for (let i = 0; i < 5000000; i++) {
    // Critical section
    lock(seal);
    numberBuffer[0] += 1;
    unlock(seal);
}