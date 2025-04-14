const net = require('net');
const fs = require('fs/promises');
const path = require('path');

host = '::1';
port = 5050;

const socket = net.createConnection({ host, port }, async () => {
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    const fileHandler = await fs.open(filePath, 'r');
    const fileReadStream = fileHandler.createReadStream();

    socket.write(`fileName: ${fileName}-------`);

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