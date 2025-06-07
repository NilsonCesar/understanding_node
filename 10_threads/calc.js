const { Worker, workerData, parentPort } = require('worker_threads');

// const { port, id } = workerData;

// port.postMessage('some text for testing ' + id);

// port.on('message', msg => {
//     console.log('Worker received:', msg);
// });


const port =  parentPort;

port.postMessage('Test from thread!');

port.on('message', msg => {
    console.log('Receive this message:', msg);
});