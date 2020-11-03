const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const route = require('./routes');
const winston = require('winston');
const expressWinston = require('express-winston');

// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger({
level: 'info',
transports: [
    new (winston.transports.File)({
            name: 'info-file',
            filename: 'api-info.log',
            level: 'info'
    })
],
format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.printf(info => {return `${info.timestamp} ${info.level}: ${info.message} ${JSON.stringify(info.meta)}`;})
)
}));

expressWinston.requestWhitelist.push('body');
expressWinston.responseWhitelist.push('body');

app.use(morgan('dev'));
app.use(cors());
app.use('/', route);

app.use((req, res, next) => {
    const err = new Error("Page not found")
    err.status = 404
    next(err)
});

module.exports = app;