const net = require('net');
const fs = require('fs/promises');

const host = '::1';
const port = 5050;
const server = net.createServer(() => {});
let fileHandler, fileStream;

server.on('connection', (socket) => {
    console.log('New connection!');

    socket.on('data', async data => {
        fileHandler = await fs.open(`storage/test.txt`, 'w');
        fileStream = fileHandler.createWriteStream();
        fileStream.write(data);
    });

    socket.on('end', () => {
        console.log('Connection ended!');
        fileHandler.close();
    })
});

server.listen(port, host, () => {
    console.log(`Uploader server opened on ${JSON.stringify(server.address())}`);
});