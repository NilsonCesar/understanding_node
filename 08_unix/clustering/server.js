const cpeak = require('cpeak');

const server = new cpeak();
const PORT = 5090;

process.on('message', (message) => {
  console.log('Worker', process.pid, 'received message from parent:', message);
});

// process.send('NOOOOOOOO');

server.route('get', '/', (req, res) => {
  res.json({ message: 'This is some text.' });
});

server.route('get', '/heavy', (req, res) => {
  console.time('heavyOperationTime');
  for (let i = 0; i < 10000000000; i++) {}
  console.timeEnd('heavyOperationTime');
  res.json({ message: 'The operation is done.'});
});

server.listen(PORT, () => {
  console.log('Server has started on port ' + PORT);  
});
