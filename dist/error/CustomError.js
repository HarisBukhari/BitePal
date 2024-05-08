"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthenticatedError = exports.NotFoundError = exports.BadRequestError = exports.CustomError = void 0;
const http_status_codes_1 = require("http-status-codes");
class CustomError extends Error {
    constructor(message, source) {
        super(`[${source}] ${message}`);
        this.name = `[${source}] ${message}`;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this);
    }
}
exports.CustomError = CustomError;
class BadRequestError extends CustomError {
    constructor(message, source) {
        super(message, source);
        this.statusCode = http_status_codes_1.StatusCodes.BAD_REQUEST;
    }
}
exports.BadRequestError = BadRequestError;
class NotFoundError extends CustomError {
    constructor(message, source) {
        super(message, source);
        this.statusCode = http_status_codes_1.StatusCodes.NOT_FOUND;
    }
}
exports.NotFoundError = NotFoundError;
class UnauthenticatedError extends CustomError {
    constructor(message, source) {
        super(message, source);
        this.statusCode = http_status_codes_1.StatusCodes.UNAUTHORIZED;
    }
}
exports.UnauthenticatedError = UnauthenticatedError;
//# sourceMappingURL=CustomError.js.map