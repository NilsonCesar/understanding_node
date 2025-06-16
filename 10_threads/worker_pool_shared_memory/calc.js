const factorial = require('./factorial.js');
const generatePrimes = require('./prime_generator.js');
const { parentPort, workerData } = require('worker_threads');

const primes = new BigUint64Array(workerData.primes);
const primesSeal = new Int32Array(workerData.primesSeal);

const lock = (seal) => {
    while (Atomics.compareExchange(seal, 0, 0, 1)) {
        Atomics.wait(seal, 0, 1);
    }
}

const unlock = (seal) => {
    Atomics.store(seal, 0, 0);
    Atomics.notify(seal, 0, 1);
}


parentPort.on('message', ({taskName, options}) => {
    switch (taskName) {
        case 'generatePrimes':
            const generatedPrimes = generatePrimes(options.count, options.start, { format: options.format, log: options.log });
            lock(primesSeal);
            primes.set(generatedPrimes, primes.indexOf(0n));
            unlock(primesSeal);
            break;
        case 'factorial':
            const factorialResult = factorial(options.n);
            parentPort.postMessage(factorialResult);
            break;
        default:
            parentPort.postMessage('Unknown task');
    }
});