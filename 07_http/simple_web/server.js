const http = require('node:http');
const fs = require('node:fs/promises');
const server = http.createServer();
const port = 9000;

server.on('request', async (request, response) => {
    if (request.url === '/' && request.method === 'GET') {
        response.setHeader('Content-Type', 'text/html');

        const fileHandler = await fs.open('./public/index.html');
        const fileStream = fileHandler.createReadStream();

        fileStream.pipe(response);
    }

    console.log(request.url);
    console.log(request.method);
});

server.listen(port, () => {
    console.log(`Web server is live at http://localhost:${port}`)
})