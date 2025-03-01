const EventEmitter = require('events');

class Emitter extends EventEmitter {}

const myE = new Emitter();

myE.once('foo', () => {
    console.log('An event occurred 1.');
});

myE.on('foo', () => {
    console.log('An event occurred 2.');
});

myE.on('foo', (x) => {
    console.log('An event occurred with parameter: ' + x);
});

myE.once('bar', () => {
    console.log('An bar event occur');
});

myE.once('bar', () => {
    console.log('An bar event occur, again...');
});

myE.emit('inexistent event');

myE.emit('foo');
myE.emit('foo', 'parameter');

myE.emit('bar');
console.log('Trying emit bar event again');
myE.emit('bar');
