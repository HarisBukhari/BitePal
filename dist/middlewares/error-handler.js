"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = exports.errorHandlerMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err.name);
    let customError = {
        statusCode: err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong try again later',
    };
    if (err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(',');
        customError.statusCode = 400;
    }
    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        customError.statusCode = 400;
    }
    if (err.name === 'CastError') {
        customError.msg = `No item found with id : ${err.value}`;
        customError.statusCode = 404;
    }
    return res.status(customError.statusCode).json({ msg: customError.msg });
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
const ErrorHandler = (err, req, res, next) => {
    console.log(err.name);
    const statusCode = err.statusCode || 500;
    const data = err.data || err.message;
    return res.status(statusCode).json(data);
};
exports.ErrorHandler = ErrorHandler;
//# sourceMappingURL=error-handler.js.map