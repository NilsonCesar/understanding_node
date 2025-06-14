const { Worker } = require('worker_threads');
const { Buffer } = require('buffer');

const number = Buffer.from(new SharedArrayBuffer(4));
const seal = Buffer.from(new SharedArrayBuffer(8));
const THREADS = 3;
let completed = 0;

for (let i = 0; i < THREADS; i++) {
	const worker = new Worker('./calc.js', { workerData: { number: number.buffer, seal: seal.buffer } });

    worker.on('exit', () => {
        completed++;

        if (completed === THREADS) {
            console.log('Final number is:', number.readUInt32LE());
            console.log(seal);
        }
    })
}

// setTimeout(() => {
// 	console.log('Data in main after 1 second:', data);
// }, 1000);