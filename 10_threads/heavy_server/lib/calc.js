const { workerData, parentPort } = require('worker_threads');
const { performance } = require('perf_hooks');
const generatePrimes = require('../lib/prime_generator');

const start = performance.now();
const primes = generatePrimes(workerData.count, workerData.startingNumber, { format: true });

parentPort.postMessage({
	primes,
	time: ((performance.now() - start) / 1000).toFixed(2)
})