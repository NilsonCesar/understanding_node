const net = require('net');

const server = net.createServer();

server.on('connection', socket => {
    console.log('A new conection to the server');
})

server.listen(3008, '127.0.0.1', () => {
    console.log(`Opened server on`, server.address());
});