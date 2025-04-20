const http = require('node:http');

const port = 8050;
const host = 'localhost';

const server = http.createServer();

server.on('request', (req, res) => {
    console.log(req.method);
    console.log(req.url);
    console.log(req.headers);

    req.on('data', chunk => {
        console.log(chunk.toString());
    });
});

server.listen(port, host, () => {
    console.log(`Server listening on: ${host}:${port}`);
});