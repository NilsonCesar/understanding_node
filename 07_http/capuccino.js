const http = require('node:http');
const fs = require('node:fs/promises');

class Capuccino {
    constructor() {
        this.server = http.createServer();
        this.routes = {};

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

            const cb = this.routes[req.method.toLocaleLowerCase() + ' ' + req.url.toLocaleLowerCase()];
            if (cb) cb(req, res);
            else res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
        })
    }

    listen = (port, cb) => this.server.listen(port, cb);

    route = (method, path, cb) => 
        this.routes[method.toLocaleLowerCase() + ' ' + path.toLocaleLowerCase()] = cb;
}

module.exports = Capuccino;