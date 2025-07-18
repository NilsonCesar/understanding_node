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
  const routesToAuthenticate = ['GET /api/user', "PUT /api/user", "POST /api/posts", "DELETE /api/logout"];

  if (routesToAuthenticate.indexOf(req.method + ' ' + req.url) === -1) return next();
  
  const token = req.headers.cookie;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const tokenArr = token.split('=');
  const tokenStr = tokenArr[1];
  const session = SESSIONS.find(session => session.token === tokenStr);

  if (session) {
    req.userId = session.userId;
    return next();
  }
  else res.status(401).json({ error: 'Unauthorized' }); 

});

server.beforeEach((req, res, next) => {
  // To small applications. When size(body) <= highWaterMark
  if (req.headers['content-type'] === 'application/json') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      body = JSON.parse(body);
      req.body = body;
      return next();
    });
  } else {
    next();
  }
});

server.beforeEach((req, res, next) => {
  routes = ['/', '/login', '/profile', '/new-post'];
  
  if (routes.indexOf(req.url) === -1 || req.method !== 'GET') return next();

  return res.status(200).sendFile('./public/index.html', 'text/html');
});

// ----- Files Routes ----- //

// Log a user in and give them a token
server.route('post', '/api/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
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

server.route('post', '/api/posts', (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const post = { id: POSTS.length + 1, title, body, userId: req.userId };
  POSTS.push(post);
  res.status(201).json(post);
});

server.route('put', '/api/user', (req, res) => {
  const name = req.body.name;
  const password = req.body.password;
  const username = req.body.username;
  const user = USERS.find(user => user.id === req.userId);

  if (name) user.name = name;
  if (password) user.password = password;
  if (username) user.username = username;

  res.status(200).json({ name, username, password_status: password ? 'changed' : 'not changed' });
});

server.route('delete', '/api/logout', (req, res) => {
  const sessionIndex = SESSIONS.findIndex(session => session.userId === req.userId);
  if (sessionIndex >= 0) {
    SESSIONS.splice(sessionIndex, 1);
  }

  res.setHeader('Set-Cookie', 'token=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
  res.status(200).json({ message: 'Logged out successfully' })
});

// Send the the list of all post that we have
server.route('get', '/', (req, res) => {
  res.sendFile('./public/index.html', 'text/html');
});

server.route('get', '/login', (req, res) => {
  res.sendFile('./public/index.html', 'text/html');
});

server.route('get', '/api/user', (req, res) => {
  const user = USERS.find(user => user.id === req.userId);
  res.json({ username: user.username, name: user.name });
});

server.route('get', '/styles.css', (req, res) => {
  res.sendFile('./public/styles.css', 'text/css');
});

server.route('get', '/scripts.js', (req, res) => {
  res.sendFile('./public/scripts.js', 'text/javascript');
});

// ----- Json Routes ----- //
server.route('get', '/api/posts', (req, res) => {
  const posts = [];

  for (let i = POSTS.length - 1; i >= 0; i--) {
    let post = { ...POSTS[i] };
    const user = USERS.find(user => user.id === post.userId);
    post.author = user.name;
    posts.push(post);
  }

  res.status(200).json(posts);
});

server.listen(PORT, () => {
  console.log('Server has started on port', PORT);
});
