const http = require('node:http');

const port = 8050;
const host = 'localhost';

const server = http.createServer();

server.on('request', (req, res) => {
    console.log('------------ METHOD ------------');
    console.log(req.method);
    console.log('------------ URL ------------');
    console.log(req.url);
    console.log('------------ HEADERS ------------');
    console.log(req.headers);

    const name = req.headers.name;
    let data = '';

    req.on('data', chunk => {
        data = chunk.toString();
    });

    req.on('end', () => {
        data = JSON.parse(data);
        console.log('------------ NAME ------------');
        console.log(name);
        console.log('------------ DATA ------------');
        console.log(data);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: `Post with title: ${data.title} was created by ${name}` }))
    })
});

server.listen(port, host, () => {
    console.log(`Server listening on: ${host}:${port}`);
});