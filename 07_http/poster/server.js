const Capuccino = require('../capuccino');

const USERS = [
  {
    id: 1,
    name: 'Uncle Bob',
    username: 'bob123',
    password: 'clean',
  },
  {
    id: 2,
    name: 'Alan Turing',
    username: 'alan',
    password: 'prove',
  },
  {
    id: 3,
    name: 'Godard',
    username: 'imnotauser',
    password: 'typicallyfrench',
  },
];

const POSTS = [
  {
    id: 1,
    title: 'The first post in poster',
    body: 'Definitively, it isnt an elephant video',
    userId: 1,
  },
];

const PORT = 8000;
const server = new Capuccino();

// ----- Files Routes ----- //
server.route('get', '/', (req, res) => {
  res.sendFile('./public/index.html', 'text/html');
});

server.route('get', '/styles.css', (req, res) => {
  res.sendFile('./public/styles.css', 'text/css');
});

server.route('get', '/scripts.js', (req, res) => {
  res.sendFile('./public/scripts.js', 'text/javascript');
});

// ----- Json Routes ----- //
server.route('get', '/api/posts', (req, res) => {
  const posts = POSTS.map(post => {
    const user = USERS.find(user => user.id === post.userId);
    post.author = user.name;
    return post;
  });
  res.status(200).json(posts);
});

server.listen(PORT, () => {
  console.log('Server has started on port', PORT);
});
