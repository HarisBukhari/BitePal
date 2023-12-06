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
exports.validateSign = exports.generateSign = exports.verifyPassword = exports.hashPassword = exports.generateSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
// const saltRounds = 10 // You can adjust the number of salt rounds as needed.
//Function to generate salt
const generateSalt = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.genSalt();
});
exports.generateSalt = generateSalt;
// Function to hash a password
const hashPassword = (plainPassword, salt) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(plainPassword, salt);
});
exports.hashPassword = hashPassword;
// Function to verify a password
const verifyPassword = (plainPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(plainPassword, hashedPassword);
});
exports.verifyPassword = verifyPassword;
const generateSign = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.AppSecret, { expiresIn: '7d' });
};
exports.generateSign = generateSign;
const validateSign = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get('Authorization');
    if (token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token.split(' ')[1], config_1.AppSecret);
            req.User = payload;
            return true;
        }
        catch (err) {
            console.log("utility error");
            return false;
        }
    }
    return false;
});
exports.validateSign = validateSign;
//# sourceMappingURL=GeneratePassword.js.map