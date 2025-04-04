const net = require('net');
const socket = net.createConnection({port: 3100, host: '127.0.0.1'}, () => {
  const buffer = Buffer.alloc(2);
  buffer[0] = 10;
  buffer[1] = 22;
  socket.write(buffer);
})
