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
        'Content-Type': 'application/json'
    }
});

request.on('response', (response) => {

});

request.write(JSON.stringify({message: 'Hi there!'}));
request.write(JSON.stringify({message: 'I need improve my math!'}));
request.write(JSON.stringify({message: 'Still learning node!'}));

request.end(JSON.stringify({message: 'This is the end of our time =('}));