const responseTime = require('response-time');
const morgan = require('morgan');
const logger = require('../config/logger');
const {
    httpRequestDuration,
    httpRequestTotal,
    activeConnections
} = require('../config/metrics');

const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
        stream: {
            write: (message) => logger.http(message.trim())
        }
    }
);

const metricsMiddleware = responseTime((req, res, time) => {
    if (req.route) {
        const route = req.route.path;
        const method = req.method;
        const statusCode = res.statusCode;

        httpRequestDuration
            .labels(method, route, statusCode)
            .observe(time / 1000);

        httpRequestTotal
            .labels(method, route, statusCode)
            .inc();
    }
});

const connectionTracker = (req, res, next) => {
    activeConnections.inc();
    res.on('finish', () => {
        activeConnections.dec();
    });
    next();
};

module.exports = {
    morganMiddleware,
    metricsMiddleware,
    connectionTracker
};