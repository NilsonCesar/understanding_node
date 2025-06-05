const { Worker } = require('worker_threads');

const a = 400;

const thread0 = new Worker('./calc.js');
const thread1 = new Worker('./calc.js');

// It will be blocked!
// setTimeout(
//     fs.writeFile('./text.txt', 'This is a threading test, follow the thread!', (e) => {
//         if (e) return console.error(e);
//         console.log('File was created');
// }), 3000);

while (true) {}

setTimeout(() => {
    const thread2 = new Worker('./calc.js');
}, 500);

console.log(a);
console.log(process.pid);