const net = require('net');
const fs = require('fs/promises');
const path = require('path');

const host = '::1';
const port = 5050;

const clearLine = dir => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve();
        });
    })
}

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        });
    })
}

const socket = net.createConnection({ host, port }, async () => {
    console.log();
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    const fileHandler = await fs.open(filePath, 'r');
    const fileReadStream = fileHandler.createReadStream();
    const fileSize = (await fileHandler.stat()).size;
    
    let uploadedPercentage = 0, bytesUploaded = 0;

    socket.write(`fileName: ${fileName}-------`);

    fileReadStream.on('data', data => {
        if(!socket.write(data)) {
            fileReadStream.pause();
        }

        bytesUploaded += data.length;
        let newPercentage = Math.floor(bytesUploaded / fileSize) * 100;

        if (newPercentage != uploadedPercentage) {
            uploadedPercentage = newPercentage;
            moveCursor(0, -1);
            clearLine(0);
            console.log(`Uploading... ${uploadedPercentage}`);
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