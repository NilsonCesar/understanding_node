const { Worker, MessageChannel } = require('worker_threads');

// const a = 400;

// const thread0 = new Worker('./calc.js', { workerData: 'text' });
// const thread1 = new Worker('./calc.js');

// It will be blocked!
// setTimeout(
//     fs.writeFile('./text.txt', 'This is a threading test, follow the thread!', (e) => {
//         if (e) return console.error(e);
//         console.log('File was created');
// }), 3000);

// while (true) {}

// setTimeout(() => {
//     const thread2 = new Worker('./calc.js');
// }, 500);

// console.log(a);
// console.log(process.pid);

// const messageChannel = new MessageChannel();
// console.log(messageChannel);

// const port1 = messageChannel.port1;
// const port2 = messageChannel.port2;

// port1.postMessage({ name: 'Joe' });
// port2.on('message', msg => {
//     console.log('Message received from port2:', msg);
// });


// const { port1, port2 } = new MessageChannel();

// const thread1 = new Worker('./calc.js', {
//     workerData: { port: port1 },
//     transferList: [port1]
// });

// const thread2 = new Worker('./calc.js', {
//     workerData: { port: port2 },
//     transferList: [port2]
// });


// const channelThread1 = new MessageChannel();
// const port_main_1 = channelThread1.port1;
// const port1 = channelThread1.port2;

// const channelThread2 = new MessageChannel();
// const port_main_2 = channelThread2.port1;
// const port2 = channelThread2.port2;

// port_main_1.on('message', msg => {
//     console.log('Message received from thread1:', msg);
// });

// port_main_2.on('message', msg => {
//     console.log('Message received from thread2:', msg);
// });

// const thread1 = new Worker('./calc.js', {
//     workerData: { port: port1, id: 'from thread1!' },
//     transferList: [port1]
// });

// const thread2 = new Worker('./calc.js', {
//     workerData: { port: port2, id: 'from thread2!'},
//     transferList: [port2]
// });

const thread1 = new Worker('./calc.js');

thread1.on('message', msg => {
    console.log('Main thread receive this message:', msg);
});

thread1.postMessage({ letra: 'Maracatu atomicooo' });