const net = require('net');
const fs = require('fs/promises');

host = '::1';
port = 5050;

const socket = net.createConnection({ host, port }, async () => {
    const filePath = 'text.txt';
    const fileHandler = await fs.open(filePath, 'r');
    const fileReadStream = fileHandler.createReadStream();

    fileReadStream.on('data', data => {
        if(!socket.write(data)) {
            fileReadStream.pause();
        }
    });

    socket.on('drain', () => {
        fileReadStream.resume();
    });

    fileReadStream.on('end', () => {
        console.log('The file was uploaded successfully!');
        socket.end();
    });
});