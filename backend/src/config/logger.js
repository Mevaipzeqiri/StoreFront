const winston = require('winston');
const path = require('path');

const logFormat = winston.format.combine(
    winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.errors({stack: true}),
    winston.format.splat(),
    winston.format.json()
);

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: {service: 'webstore-api'},
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({timestamp, level, message, ...meta}) => {
                    let msg = `${timestamp} [${level}]: ${message}`;
                    if (Object.keys(meta).length > 0 && meta.service !== 'webstore-api') {
                        msg += ` ${JSON.stringify(meta)}`;
                    }
                    return msg;
                })
            )
        }),
        new winston.transports.File({
            filename: path.join('logs', 'combined.log'),
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: path.join('logs', 'error.log'),
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
        })
    ]
});

module.exports = logger;