const http = require('node:http');

const port = 8050;
const hostname = 'localhost';

const agent = http.Agent({ keepAlive: true });

const request = http.request({
    agent,
    hostname,
    port,
    method: 'POST',
    path: '/create-post',
    headers: {
        'Content-Type': 'application/json',
        'name': 'Bob'
    }
});

request.on('response', (response) => {
    console.log(response.statusCode);
    console.log(response.headers);
    
    response.on('data', chunk => {
        console.log(chunk.toString());
    });

    response.on('end', () => {
        console.log('No more data in response');
    });
});

request.end(JSON.stringify({title: 'Hi there! This is a title!', body: 'Still learning node!'}));