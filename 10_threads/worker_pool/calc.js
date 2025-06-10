const factorial = require('./factorial.js');
const generatePrimes = require('./prime_generator.js');
const { parentPort } = require('worker_threads');

parentPort.on('message', ({taskName, options}) => {
    switch (taskName) {
        case 'generatePrimes':
            const primes = generatePrimes(options.count, options.start, { format: options.format, log: options.log });
            parentPort.postMessage(primes);
            break;
        case 'factorial':
            const factorialResult = factorial(options.n);
            parentPort.postMessage(factorialResult);
            break;
        default:
            parentPort.postMessage('Unknown task');
    }
});