const dgram = require('dgram');
const receiver = dgram.createSocket('udp4');

receiver.on('message', (msg, remoteInfo) => {
  console.log(msg.toString());
  console.log(remoteInfo);
});

receiver.bind({address: '127.0.0.1', port: 4000});

receiver.on('listening', () => {
  console.log(`Server listening on port ${JSON.stringify(receiver.address())}`);
});