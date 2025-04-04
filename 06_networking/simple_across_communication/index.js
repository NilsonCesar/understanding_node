const http = require('http');

port = 4080;
hostname = '127.0.0.1'; // to localhost

const server = http.createServer( (req, res) => {
  const data = { message: 'Hello World!' };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Connection', 'close');
  res.end(JSON.stringify(data));
});

server.listen(port, hostname, () => {
  console.log('Server created!', server.address(), port);
});
