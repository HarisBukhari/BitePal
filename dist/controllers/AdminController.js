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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVendorById = exports.GetVendors = exports.CreateVendor = exports.findVendor = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var models_1 = require("../models");
var utilities_1 = require("../utilities");
var findVendor = function (id, email) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!email) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Vendor.findOne({ email: email })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, models_1.Vendor.findOne({ _id: id })];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findVendor = findVendor;
var CreateVendor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, address, email, foodType, name, ownerName, password, phone, pincode, findOne, bcryptSalt, bcryptPassword, CreateVendor_1, err_1, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, address = _a.address, email = _a.email, foodType = _a.foodType, name = _a.name, ownerName = _a.ownerName, password = _a.password, phone = _a.phone, pincode = _a.pincode;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 11, , 12]);
                return [4 /*yield*/, (0, exports.findVendor)('', email)];
            case 2:
                findOne = _b.sent();
                if (!!findOne) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, utilities_1.generateSalt)()];
            case 3:
                bcryptSalt = _b.sent();
                return [4 /*yield*/, (0, utilities_1.hashPassword)(password, bcryptSalt)];
            case 4:
                bcryptPassword = _b.sent();
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, models_1.Vendor.create({
                        name: name,
                        email: email,
                        address: address,
                        foodType: foodType,
                        ownerName: ownerName,
                        password: bcryptPassword,
                        phone: phone,
                        pincode: pincode,
                        salt: bcryptSalt,
                        rating: 0,
                        serviceAvailable: false,
                        coverImage: [],
                    })];
            case 6:
                CreateVendor_1 = _b.sent();
                return [2 /*return*/, res.status(201).json({ "success": CreateVendor_1 })];
            case 7:
                err_1 = _b.sent();
                console.error('Database error:', err_1);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 8];
            case 8: return [3 /*break*/, 10];
            case 9: return [2 /*return*/, res.status(403).json({ "Failed": "Already Exists" })];
            case 10: return [3 /*break*/, 12];
            case 11:
                err_2 = _b.sent();
                console.error('Database error:', err_2);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 12];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.CreateVendor = CreateVendor;
var GetVendors = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var allVendors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.Vendor.find()];
            case 1:
                allVendors = _a.sent();
                if (allVendors.length > 0) {
                    return [2 /*return*/, res.status(200).json(allVendors)];
                }
                else {
                    return [2 /*return*/, res.status(204).json({ success: "No Vendor Found" })];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.GetVendors = GetVendors;
var GetVendorById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendorId, vendor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vendorId = req.params.id;
                if (!mongoose_1.default.Types.ObjectId.isValid(vendorId)) return [3 /*break*/, 2];
                return [4 /*yield*/, (0, exports.findVendor)(vendorId, '')];
            case 1:
                vendor = _a.sent();
                if (vendor) {
                    return [2 /*return*/, res.status(200).json(vendor)];
                }
                return [2 /*return*/, res.status(204).json({ Failed: 'Vendor not Found' })];
            case 2: 
            // It's not a valid ObjectID, return an error response.
            return [2 /*return*/, res.status(403).json({ Error: 'Invalid vendor ID' })];
        }
    });
}); };
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminController.js.map