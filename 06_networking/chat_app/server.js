const net = require('net');

const server = net.createServer();

const clients = [];

server.on('connection', socket => { 
    console.log('A new conection to the server');

    const clientId = clients.length + 1;
    socket.write(`id-${clientId}`)

    clients.map(client => {
        client.socket.write(`User ${clientId} joined!`);
    });

    socket.on('data', data => {
	const dataString = data.toString('utf-8');
	const id = dataString.substring(0, dataString.indexOf('-'));
	const message = dataString.substring(dataString.indexOf('-message-') + 9);
	
        clients.map(client => {
            client.socket.write(`> User ${id}: ${message}`);
	});
    });

    socket.on('end', () => {
	clients.map(client => {
	   client.socket.write(`User ${clientId} left!`);
	});
    });

    clients.push({ id: clientId.toString(), socket });
});

server.listen(3008, '127.0.0.1', () => {
    console.log(`Opened server on`, server.address());
});
