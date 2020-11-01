const express = require('express');
const expressWinston = require('express-winston');
const winston = require('winston'); // for transports.Console
const morgan = require('morgan');
const cors = require('cors');

const app = express();
const route = require('./routes');

app.use(morgan('dev'));
app.use(cors());


// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger({
transports: [
    new winston.transports.Console()
],
format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
)
}));

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

app.use('/', route);

// express-winston errorLogger makes sense AFTER the router.
app.use(expressWinston.errorLogger({
transports: [
    new winston.transports.Console()
],
format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
)
}));

app.use((req, res, next) => {
    const err = new Error("Page not found")
    err.status = 404
    next(err)
});



module.exports = app;