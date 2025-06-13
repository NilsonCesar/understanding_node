const { Worker, workerData } = require('worker_threads');

const flag = new Int32Array(new SharedArrayBuffer(4));

for (let i = 0; i < 4; i++) {
    new Worker('./calc.js', { workerData: { flag: flag.buffer } });
}

setTimeout(() => {
    console.log('heeeree');
    console.log(flag[0]);
    Atomics.store(flag, 0, 2);
    console.log(flag[0]);
    Atomics.notify(flag, 0);
}, 10000);

setTimeout(() => {
    console.log(flag[0]);
}, 15000);