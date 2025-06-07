// Controllers
const User = require("./controllers/user");
const { performance } = require('perf_hooks');
const { Worker } = require('worker_threads');

module.exports = (server) => {
  // ------------------------------------------------ //
  // ************ USER ROUTES ************* //
  // ------------------------------------------------ //

  // Log a user in and give them a token
  server.route("post", "/api/login", User.logUserIn);

  // Log a user out
  server.route("delete", "/api/logout", User.logUserOut);

  // Send user info
  server.route("get", "/api/user", User.sendUserInfo);

  // Update a user info
  server.route("put", "/api/user", User.updateUser);

  // ------------------------------------------------ //
  // ************ PRIME NUMBER ROUTES ************* //
  // ------------------------------------------------ //

  server.route("get", "/api/primes", (req, res) => {
    const count = Number(req.params.get('count'));
    let startingNumber = BigInt(req.params.get('start'));

    if (startingNumber < BigInt(Number.MAX_SAFE_INTEGER)) {
      startingNumber = Number(startingNumber);
    }

    const worker = new Worker('./lib/calc.js', {workerData: {
      count,
      startingNumber
    }});

    const t = setTimeout(() => {
      worker.terminate();
      res.status(400).json({ message: 'Request time out' });
    }, 5000);

    worker.on('message', msg => {
      clearTimeout(t);
      res.json({
        primes: msg.primes,
        time: msg.time,
      });
    })
  });
};
