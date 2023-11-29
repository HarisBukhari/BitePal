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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoods = exports.addFood = exports.updateVendorImage = exports.updateVendorService = exports.updateVendor = exports.getVendor = exports.login = void 0;
var _1 = require(".");
var utilities_1 = require("../utilities");
var food_1 = require("../models/food");
//Vendor Controller
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, validPassword, sign;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                if (!(email && password)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, _1.findVendor)('', email)];
            case 1:
                user = _b.sent();
                if (!user) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, utilities_1.verifyPassword)(password, user.password)];
            case 2:
                validPassword = _b.sent();
                if (validPassword) {
                    sign = (0, utilities_1.generateSign)({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        foodType: user.foodType
                    });
                    return [2 /*return*/, res.status(200).send({ token: sign })];
                }
                return [2 /*return*/, res.status(400).send({ message: "Please enter correct email and password" })];
            case 3: return [2 /*return*/, res.status(204).send({ message: "Vendor not found" })];
            case 4: return [2 /*return*/, res.status(400).send({ message: "Please enter your email and password" })];
        }
    });
}); };
exports.login = login;
var getVendor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendor, vendorProfile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vendor = req.User;
                console.log(vendor);
                if (!vendor) return [3 /*break*/, 2];
                return [4 /*yield*/, ((0, _1.findVendor)(vendor._id, ""))];
            case 1:
                vendorProfile = _a.sent();
                if (vendorProfile) {
                    res.status(200).json(vendorProfile);
                }
                else {
                    res.status(404).json({ message: "Something went wrong" });
                }
                return [3 /*break*/, 3];
            case 2:
                res.status(404).json({ message: "Something went wrong" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getVendor = getVendor;
var updateVendor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendor, _a, address, foodType, name, phone, vendorProfile, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                vendor = req.User;
                _a = req.body, address = _a.address, foodType = _a.foodType, name = _a.name, phone = _a.phone;
                if (!vendor) return [3 /*break*/, 8];
                return [4 /*yield*/, ((0, _1.findVendor)(vendor._id, ""))];
            case 1:
                vendorProfile = _b.sent();
                if (!vendorProfile) return [3 /*break*/, 6];
                vendorProfile.foodType = foodType;
                vendorProfile.name = name;
                vendorProfile.address = address;
                vendorProfile.phone = phone;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                return [4 /*yield*/, vendorProfile.save()];
            case 3:
                _b.sent();
                res.status(200).json(vendorProfile);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error('Database error:', error_1);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(404).json({ message: "Something went wrong" });
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(404).json({ message: "Something went wrong" });
                _b.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.updateVendor = updateVendor;
var updateVendorService = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendor, vendorProfile, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vendor = req.User;
                if (!vendor) return [3 /*break*/, 8];
                return [4 /*yield*/, ((0, _1.findVendor)(vendor._id, ""))];
            case 1:
                vendorProfile = _a.sent();
                if (!vendorProfile) return [3 /*break*/, 6];
                vendorProfile.serviceAvailable = !vendorProfile.serviceAvailable;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, vendorProfile.save()];
            case 3:
                _a.sent();
                res.status(200).json(vendorProfile);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error('Database error:', error_2);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(404).json({ message: "Something went wrong" });
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(404).json({ message: "Something went wrong" });
                _a.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.updateVendorService = updateVendorService;
var updateVendorImage = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendor, vendorProfile, files, images, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                vendor = req.User;
                if (!vendor) return [3 /*break*/, 8];
                return [4 /*yield*/, ((0, _1.findVendor)(vendor._id, ""))];
            case 1:
                vendorProfile = _b.sent();
                if (!vendorProfile) return [3 /*break*/, 6];
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                files = req.files;
                images = files.map(function (file) { return file.filename; });
                (_a = vendorProfile.coverImage).push.apply(_a, images);
                return [4 /*yield*/, vendorProfile.save()];
            case 3:
                _b.sent();
                return [2 /*return*/, res.status(201).json({ "success": vendorProfile })];
            case 4:
                error_3 = _b.sent();
                console.error('Database error:', error_3);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(404).json({ message: "Something went wrong" });
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                res.status(404).json({ message: "Something went wrong" });
                _b.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.updateVendorImage = updateVendorImage;
//Food Controller
var addFood = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendor, vendorProfile, _a, name_1, category, description, foodType, price, readyTime, files, images, food, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                vendor = req.User;
                if (!vendor) return [3 /*break*/, 9];
                return [4 /*yield*/, ((0, _1.findVendor)(vendor._id, ""))];
            case 1:
                vendorProfile = _b.sent();
                if (!vendorProfile) return [3 /*break*/, 7];
                _a = req.body, name_1 = _a.name, category = _a.category, description = _a.description, foodType = _a.foodType, price = _a.price, readyTime = _a.readyTime;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 5, , 6]);
                files = req.files;
                images = files.map(function (file) { return file.filename; });
                return [4 /*yield*/, food_1.Food.create({
                        vendorId: vendorProfile._id,
                        name: name_1,
                        category: category,
                        description: description,
                        foodType: foodType,
                        price: price,
                        readyTime: readyTime,
                        rating: 0,
                        image: images
                    })];
            case 3:
                food = _b.sent();
                vendorProfile.foods.push(food);
                return [4 /*yield*/, vendorProfile.save()];
            case 4:
                _b.sent();
                return [2 /*return*/, res.status(201).json({ "success": vendorProfile })];
            case 5:
                error_4 = _b.sent();
                console.error('Database error:', error_4);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(404).json({ message: "Something went wrong" });
                _b.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(404).json({ message: "Something went wrong" });
                _b.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.addFood = addFood;
var getFoods = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vendor, vendorProfile, foods, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vendor = req.User;
                if (!vendor) return [3 /*break*/, 7];
                return [4 /*yield*/, ((0, _1.findVendor)(vendor._id, ""))];
            case 1:
                vendorProfile = _a.sent();
                if (!vendorProfile) return [3 /*break*/, 6];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, food_1.Food.find({ vendorId: vendorProfile.id })];
            case 3:
                foods = _a.sent();
                if (foods.length > 0) {
                    res.status(200).json(foods);
                }
                else {
                    res.status(404).json({ message: '404 what else you can expect' });
                }
                return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.error('Database error:', err_1);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                res.status(404).json({ message: "Something went wrong" });
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getFoods = getFoods;
//# sourceMappingURL=VendorController.js.map