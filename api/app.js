const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const route = require('./routes');

app.use(morgan('dev'));
app.use(cors());
app.use('/', route);

app.use((req, res, next) => {
    const err = new Error("Page not found")
    err.status = 404
    next(err)
});

module.exports = app;