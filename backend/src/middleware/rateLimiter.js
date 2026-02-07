const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');


const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many requests from this IP, please try again later.',
            retryAfter: '15 minutes',
            limit: 100,
            windowMs: 15 * 60 * 1000
        });
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'Too many login attempts from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: 'Too many login attempts. Please try again later.',
            retryAfter: '15 minutes',
            limit: 5
        });
    }
});

// Speed limiter - slows down requests after threshold
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: (hits) => hits * 100,
    maxDelayMs: 5000,
});

const graphqlLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: {
        errors: [{
            message: 'Too many GraphQL requests from this IP.',
            extensions: {
                code: 'RATE_LIMIT_EXCEEDED',
                retryAfter: '15 minutes'
            }
        }]
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const createOrderLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        message: 'Too many orders created. Please try again later.',
        retryAfter: '1 hour'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    apiLimiter,
    authLimiter,
    speedLimiter,
    graphqlLimiter,
    createOrderLimiter
};