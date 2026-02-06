class GraphQLCustomError extends Error {
    constructor(message, code, statusCode = 400, additionalInfo = {}) {
        super(message);
        this.name = this.constructor.name;
        this.extensions = {
            code,
            statusCode,
            ...additionalInfo
        };
    }
}

class AuthenticationError extends GraphQLCustomError {
    constructor(message = 'Authentication required', additionalInfo = {}) {
        super(message, 'UNAUTHENTICATED', 401, additionalInfo);
    }
}

class AuthorizationError extends GraphQLCustomError {
    constructor(message = 'You do not have permission to perform this action', additionalInfo = {}) {
        super(message, 'FORBIDDEN', 403, additionalInfo);
    }
}

class ValidationError extends GraphQLCustomError {
    constructor(message, fieldErrors = {}) {
        super(message, 'BAD_USER_INPUT', 400, { fieldErrors });
    }
}

class NotFoundError extends GraphQLCustomError {
    constructor(resource = 'Resource', id = null) {
        const message = id
            ? `${resource} with ID ${id} not found`
            : `${resource} not found`;
        super(message, 'NOT_FOUND', 404, { resource, id });
    }
}

class ConflictError extends GraphQLCustomError {
    constructor(message = 'Resource conflict', additionalInfo = {}) {
        super(message, 'CONFLICT', 409, additionalInfo);
    }
}

class InternalServerError extends GraphQLCustomError {
    constructor(message = 'An internal server error occurred', additionalInfo = {}) {
        super(message, 'INTERNAL_SERVER_ERROR', 500, additionalInfo);
    }
}

module.exports = {
    GraphQLCustomError,
    AuthenticationError,
    AuthorizationError,
    ValidationError,
    NotFoundError,
    ConflictError,
    InternalServerError
};