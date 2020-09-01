'use strict';

const http = require('http')
const app = require('./app')
const PORT = 1337

const server = http.createServer(app);

server.listen(PORT);
console.log("Listening On Port " + PORT + "...")
