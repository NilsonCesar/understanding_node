const http = require('node:http');
const fs = require('node:fs/promises');
const server = http.createServer();
const port = 9000;

const createResponse = async (request, response, path, method, contentType, src) => {
    if (request.url === path && request.method === method) {
        response.setHeader('Content-Type', contentType);

        const fileHandler = await fs.open(src, 'r');
        const fileStream = fileHandler.createReadStream();

        fileStream.pipe(response);
    }
}

server.on('request', async (request, response) => {

    await createResponse(request, response, '/', 'GET', 'text/html', './public/index.html');
    await createResponse(request, response, '/styles.css', 'GET', 'text/css', './public/styles.css');
    await createResponse(request, response, '/scripts.js', 'GET', 'text/javascript', './public/scripts.js')

    console.log(request.url);
    console.log(request.method);
});

server.listen(port, () => {
    console.log(`Web server is live at http://localhost:${port}`)
})