const http = require('node:http');
const fs = require('node:fs/promises');

class Capuccino {
    constructor() {
        this.server = http.createServer();
        this.routes = {};
        this.middleware = [];

        this.server.on('request', (req, res) => {
            res.sendFile = async (path, mime) => {
                const fileHandler = await fs.open(path, 'r');
                const readStream = fileHandler.createReadStream();

                res.setHeader('Content-Type', mime);
                readStream.pipe(res);
            }

            res.status = code => {
                res.statusCode = code;
                return res;
            }

            res.json = json => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(json));
            }
            
            this.runMiddleware(req, res);
        })
    }

    listen = (port, cb) => this.server.listen(port, cb);

    beforeEach = (cb) => {
        this.middleware.push(cb);
    }

    runMiddleware = (req, res) => {
        if (this.middleware.length) {
            const n = this.middleware.length;
            let i = n - 1;
            let result = this.middleware[i](req, res, () => {
                const cb = this.routes[req.method.toLocaleLowerCase() + ' ' + req.url.toLocaleLowerCase()];
                if (cb) cb(req, res);
                else return res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
            });

            while (i > 0) result = this.middleware[--i](req, res, () => result);
        }
    }

    route = (method, path, cb) => 
        this.routes[method.toLocaleLowerCase() + ' ' + path.toLocaleLowerCase()] = cb;
}

module.exports = Capuccino;