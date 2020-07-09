const express = require('express');
const path = require('path');

const app = express();
const port = 80;
const host = 'localhost';

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// app.use(express.favicon());
app.use('/', express.static(path.join(__dirname, '.')));

app.listen(port, host, () => {
    console.log('Server started on %s:%d', host, port);
});

