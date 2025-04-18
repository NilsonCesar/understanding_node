const dgram = require('dgram');
const sender = dgram.createSocket('udp4');

sender.send('This is a string', 4000, '127.0.0.1', (err, bytes) => {
  if (err) console.log(err);
  console.log(bytes);
})