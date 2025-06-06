const { workerData, parentPort } = require('worker_threads');
const generatePrimes = require('./prime_generator');

const primeNumbers = generatePrimes(workerData.count, workerData.startingNumber);
parentPort.postMessage(primeNumbers);