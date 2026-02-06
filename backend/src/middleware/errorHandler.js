class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
            timestamp: new Date().toISOString(),
            path: req.path,
            method: req.method
        });
    }

    // Production
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message,
            timestamp: new Date().toISOString(),
            path: req.path
        });
    }

    // Programming or unknown errors
    console.error('ERROR 💥:', err);
    return res.status(500).json({
        success: false,
        status: 'error',
        message: 'Something went wrong!',
        timestamp: new Date().toISOString()
    });
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    AppError,
    errorHandler,
    asyncHandler
};