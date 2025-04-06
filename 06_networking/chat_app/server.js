const net = require('net');

const server = net.createServer();

const clients = [];

server.on('connection', socket => {
    console.log('A new conection to the server');

    socket.on('data', data => {
        clients.map(socket => {
            socket.write(data.toString('utf-8'));
	});
    });

    clients.push(socket);
});

server.listen(3008, '127.0.0.1', () => {
    console.log(`Opened server on`, server.address());
});
