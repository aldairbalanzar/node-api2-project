const express = require("express");
const server = express();

const postsRouter = require('./postsRouter');

server.use(express.json());

server.get('/', (req, res) => {
    res.send('waddup');
});

server.use('/api/posts', postsRouter);

module.exports = server;