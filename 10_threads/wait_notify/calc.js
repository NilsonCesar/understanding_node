const { workerData } = require('worker_threads');

const flag = new Int32Array(workerData.flag);

i = 0;

while (true) {
    i++;

    if (i == 1000) {
        console.log('Sleeping...');
        Atomics.wait(flag, 0, 0);
        Atomics.store(flag, 0, 6);
    }
}