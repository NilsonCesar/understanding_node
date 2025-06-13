const { workerData, threadId } = require('worker_threads');

const data = Buffer.from(workerData.data);

console.log('threadId:', threadId);
console.log('data:', data);

data[threadId] = 255;