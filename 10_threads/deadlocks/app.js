const { Worker } = require('worker_threads');
const { Buffer } = require('buffer');

const number = Buffer.from(new SharedArrayBuffer(4));
const A = new SharedArrayBuffer(4);
const B = new SharedArrayBuffer(4);
const THREADS = 4;
let completed = 0;

for (let i = 0; i < THREADS; i++) {
	const worker1 = new Worker('./calc1.js', { workerData: { number: number.buffer, A, B } });
	const worker2 = new Worker('./calc2.js', { workerData: { number: number.buffer, A, B } });
}

// setTimeout(() => {
// 	console.log('Data in main after 1 second:', data);
// }, 1000);