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
exports.GetVendorById = exports.GetVendors = exports.CreateVendor = exports.findVendor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const utilities_1 = require("../utilities");
const findVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Vendor.findOne({ email: email });
    }
    else {
        return yield models_1.Vendor.findOne({ _id: id });
    }
});
exports.findVendor = findVendor;
const CreateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { address, email, foodType, name, ownerName, password, phone, pincode } = req.body;
    try {
        const findOne = yield (0, exports.findVendor)('', email);
        if (!findOne) {
            const bcryptSalt = yield (0, utilities_1.generateSalt)();
            const bcryptPassword = yield (0, utilities_1.hashPassword)(password, bcryptSalt);
            try {
                const CreateVendor = yield models_1.Vendor.create({
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
                });
                return res.status(201).json({ "success": CreateVendor });
            }
            catch (err) {
                console.error('Database error:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        else {
            return res.status(403).json({ "Failed": "Already Exists" });
        }
    }
    catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.CreateVendor = CreateVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allVendors = yield models_1.Vendor.find();
    if (allVendors.length > 0) {
        return res.status(200).json(allVendors);
    }
    else {
        return res.status(204).json({ success: "No Vendor Found" });
    }
});
exports.GetVendors = GetVendors;
const GetVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.id;
    if (mongoose_1.default.Types.ObjectId.isValid(vendorId)) {
        // It's a valid ObjectID, proceed with the query.
        const vendor = yield (0, exports.findVendor)(vendorId, '');
        if (vendor) {
            return res.status(200).json(vendor);
        }
        return res.status(204).json({ Failed: 'Vendor not Found' });
    }
    else {
        // It's not a valid ObjectID, return an error response.
        return res.status(403).json({ Error: 'Invalid vendor ID' });
    }
});
exports.GetVendorById = GetVendorById;
//# sourceMappingURL=AdminController.js.map