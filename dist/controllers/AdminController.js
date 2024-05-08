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
exports.GetDeliveryUsers = exports.VerifyDeliveryUser = exports.GetTransactionById = exports.GetTransactions = exports.GetVendorById = exports.GetVendors = exports.CreateVendor = exports.findVendor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const utilities_1 = require("../utilities");
const error_1 = require("../error");
/* ------------------- Vendor Section --------------------- */
const findVendor = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (email) {
            return yield models_1.Vendor.findOne({ email: email });
        }
        else {
            return yield models_1.Vendor.findOne({ _id: id });
        }
    }
    catch (err) {
        throw new error_1.NotFoundError('Error finding vendor in the database', 'Admin/findVendor');
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
        else {
            throw new error_1.BadRequestError('Vendor Already Exists', 'Admin/CreateVendor');
        }
    }
    catch (err) {
        next(err);
    }
});
exports.CreateVendor = CreateVendor;
const GetVendors = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allVendors = yield models_1.Vendor.find();
        if (allVendors.length > 0) {
            return res.status(200).json(allVendors);
        }
        else {
            throw new error_1.NotFoundError('Error finding vendor in the database', 'Admin/findVendor');
        }
    }
    catch (err) {
        next(err);
    }
});
exports.GetVendors = GetVendors;
const GetVendorById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendorId = req.params.id;
        if (mongoose_1.default.Types.ObjectId.isValid(vendorId)) {
            // It's a valid ObjectID, proceed with the query.
            const vendor = yield (0, exports.findVendor)(vendorId, '');
            if (vendor) {
                return res.status(200).json(vendor);
            }
            throw new error_1.NotFoundError('Vendor not found', 'Admin/GetVendorById');
        }
        throw new error_1.BadRequestError('Invalid vendor ID', 'Admin/GetVendorById');
    }
    catch (err) {
        next(err);
    }
});
exports.GetVendorById = GetVendorById;
/* ------------------- Transaction Section --------------------- */
const GetTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield models_1.Transaction.find();
        if (transactions) {
            return res.status(200).json(transactions);
        }
        throw new error_1.NotFoundError('Transaction not found', 'Admin/GetTransactions');
    }
    catch (err) {
        next(err);
    }
});
exports.GetTransactions = GetTransactions;
const GetTransactionById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const transaction = yield models_1.Transaction.findById(id);
        if (transaction) {
            return res.status(200).json(transaction);
        }
        throw new error_1.NotFoundError('Transaction not found', 'Admin/GetTransactionById');
    }
    catch (err) {
        next(err);
    }
});
exports.GetTransactionById = GetTransactionById;
/* ------------------- Delivery Section --------------------- */
const VerifyDeliveryUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, status } = req.body;
        if (_id) {
            const profile = yield models_1.DeliveryUser.findById(_id);
            if (profile) {
                profile.verified = status;
                const result = yield profile.save();
                return res.status(200).json(result);
            }
        }
        throw new error_1.BadRequestError('Unable to verify Delivery User', 'Admin/VerifyDeliveryUser');
    }
    catch (err) {
        next(err);
    }
});
exports.VerifyDeliveryUser = VerifyDeliveryUser;
const GetDeliveryUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryUsers = yield models_1.DeliveryUser.find();
        if (deliveryUsers) {
            return res.status(200).json(deliveryUsers);
        }
        throw new error_1.BadRequestError('Unable to get Delivery Users', 'Admin/GetDeliveryUsers');
    }
    catch (err) {
        next(err);
    }
});
exports.GetDeliveryUsers = GetDeliveryUsers;
//# sourceMappingURL=AdminController.js.map