const net = require('net');
const fs = require('fs/promises');

host = '::1';
port = 5050;

const socket = net.createConnection({ host, port }, async () => {
    const filePath = 'text.txt';
    const fileHandler = await fs.open(filePath, 'r');
    const fileStream = fileHandler.createReadStream();

    fileStream.on('data', data => {
        socket.write(data);
    });

    fileStream.on('end', () => {
        console.log('The file was uploaded successfully!');
        socket.end();
    });
});