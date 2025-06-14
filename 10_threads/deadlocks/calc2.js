const { workerData, threadId } = require('worker_threads');

const numberBuffer = new Uint32Array(workerData.number);
const A = new Int32Array(workerData.A);
const B = new Int32Array(workerData.B);

const lock = (seal) => {
    while (Atomics.compareExchange(seal, 0, 0, 1)) {
        Atomics.wait(seal, 0, 1);
    }
}

const unlock = (seal) => {
    Atomics.store(seal, 0, 0);
    Atomics.notify(seal, 0, 1);
}

lock(B);
unlock(B);

console.log(`${threadId} doing work with both B & A...`);

lock(A);
unlock(A);