const Capuccino = require('../capuccino');
const PORT = 4060;

const server = new Capuccino();

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
});

server.route('GET', '/', (req, res) => {
    res.sendFile('./public/index.html', 'text/html');
});

server.route('GET', '/styles.css', (req, res) => {
    res.sendFile('./public/styles.css', 'text/css');
});

server.route('GET', '/scripts.js', (req, res) => {
    res.sendFile('./public/scripts.js', 'text/javascript');
});

server.route('POST', '/login', (req, res) => {
    res.status(200).json({ message: 'login done!' });
});
