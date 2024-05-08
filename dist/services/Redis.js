"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.del = exports.set = exports.get = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const client = new ioredis_1.default({
    password: process.env.redis_password,
    host: process.env.redis_host,
    port: parseInt(process.env.redis_port)
});
// Utility functions for Redis operations
function get(key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('done');
            const value = yield client.get(key);
            return value;
        }
        catch (error) {
            console.error('Error getting value from Redis:', error);
            return null; // Or throw an error if needed
        }
    });
}
exports.get = get;
function set(key, value, expiration) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (expiration) {
                yield client.set(key, value, 'EX', expiration);
            }
            else {
                yield client.set(key, value);
            }
            return true;
        }
        catch (error) {
            console.error('Error setting value in Redis:', error);
            return false; // Or throw an error if needed
        }
    });
}
exports.set = set;
function del(key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const deleted = yield client.del(key);
            return deleted; // Number of keys deleted (usually 1)
        }
        catch (error) {
            console.error('Error deleting key from Redis:', error);
            return 0; // Or throw an error if needed
        }
    });
}
exports.del = del;
//# sourceMappingURL=Redis.js.map