const net = require('net');
const fs = require('fs/promises');

const host = '::1';
const port = 5050;
const server = net.createServer(() => {});
let fileHandler, fileWriteStream;

server.on('connection', (socket) => {
    console.log('New connection!');

    socket.on('data', async data => {
        if (!fileHandler) {
            socket.pause()

            const indexDivider = data.indexOf('-------');
            const fileName = data.subarray(10, indexDivider).toString('utf-8');

            fileHandler = await fs.open(`storage/${fileName}`, 'w');
            fileWriteStream = fileHandler.createWriteStream();

            // we must pause the read (!) stream
            // 'drain' events only occurs in write streams
            const canWrite = fileWriteStream.write(data);
            if (!canWrite) {
                fileWriteStream.once('drain', () => socket.resume());
            } else {
                socket.resume();
            }
            fileWriteStream.on('drain', () => {
                socket.resume();
            });
        } else {
            if (!fileWriteStream.write(data)) {
                socket.pause();
            }
        }
    });

    socket.on('end', () => {
        console.log('Connection ended!');
        fileHandler.close();
        fileHandler = undefined;
        fileWriteStream = undefined;
    })
});

server.listen(port, host, () => {
    console.log(`Uploader server opened on ${JSON.stringify(server.address())}`);
});