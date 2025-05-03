const Capuccino = require('../capuccino');

// A sample object in this array would like:
// { userId: number, token: string }
const SESSIONS = []

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

server.beforeEach((req, res, next) => {
  console.log("Middleware 1!");
  next();
});

server.beforeEach((req, res, next) => {
  console.log("Middleware 2!");
  next();
});

// ----- Files Routes ----- //

// Log a user in and give them a token
server.route('post', '/api/login', (req, res) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    body = JSON.parse(body);
    
    const username = body.username;
    const password = body.password;
    const user = USERS.find(user => user.username === username);
    
    if (user && user.password === password) {
      const token = (Math.floor(Math.random() * 10000000000)).toString();
      SESSIONS.push({ userId: user.id, token: token });
      res.setHeader("Set-Cookie", `token=${token}; Path=/;`);
      res.status(200).json({ message: 'logged in successfully' });
    } else {
      res.status(401).json({ error: 'Invalid user or password invalid.' })
    }
  });
});

server.route('delete', '/api/logout', (req, res) => {});

server.route('put', '/api/update', (req, res) => {});

server.route('post', '/api/posts', (req, res) => {});

// Send the the list of all post that we have
server.route('get', '/', (req, res) => {
  res.sendFile('./public/index.html', 'text/html');
});

server.route('get', '/login', (req, res) => {
  res.sendFile('./public/index.html', 'text/html');
});

server.route('get', '/api/user', (req, res) => {
  const token = req.headers.cookie;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const tokenArr = token.split('=');
  const tokenStr = tokenArr[1];
  const session = SESSIONS.find(session => session.token === tokenStr);

  if (session) {
    const user = USERS.find(user => user.id === session.userId);
    res.json({ username: user.username, name: user.name });
  }
  else res.status(401).json({ error: 'Unauthorized' }); 
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
