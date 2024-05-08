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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeliveryUserStatus = exports.EditDeliveryProfile = exports.GetDeliveryProfile = exports.DeliveryLogin = exports.DeliverySignUp = exports.findDeliveryPerson = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("../dto");
const utilities_1 = require("../utilities");
const models_1 = require("../models");
const error_1 = require("../error");
const findDeliveryPerson = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (email) {
            return yield models_1.DeliveryUser.findOne({ email: email });
        }
        if (id) {
            return yield models_1.DeliveryUser.findOne({ _id: id });
        }
        throw new error_1.BadRequestError('Invalid inputs', 'DeliveryPerson/findDeliveryPerson');
    }
    catch (err) {
        if (err instanceof error_1.BadRequestError) {
            throw err;
        }
        throw new error_1.CustomError('An unexpected error occurred', 'DeliveryPerson/findDeliveryPerson');
    }
});
exports.findDeliveryPerson = findDeliveryPerson;
const DeliverySignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryUserInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateDeliveryUserInput, req.body);
        const validationError = yield (0, class_validator_1.validate)(deliveryUserInputs, { validationError: { target: true } });
        if (validationError.length > 0) {
            throw new error_1.BadRequestError('Invalid inputs', 'DeliveryPerson/DeliverySignUp');
        }
        const { email, phone, password, address, firstName, lastName, pincode } = deliveryUserInputs;
        const salt = yield (0, utilities_1.generateSalt)();
        const userPassword = yield (0, utilities_1.hashPassword)(password, salt);
        const existingDeliveryUser = yield models_1.DeliveryUser.findOne({ email: email });
        if (existingDeliveryUser !== null) {
            throw new error_1.BadRequestError('A Delivery User exist with the provided email ID!', 'DeliveryPerson/DeliverySignUp');
        }
        const result = yield models_1.DeliveryUser.create({
            email: email,
            password: userPassword,
            salt: salt,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            address: address,
            pincode: pincode,
            verified: false,
            lat: 0,
            lng: 0,
        });
        if (result) {
            //Generate the Signature
            const signature = (0, utilities_1.generateSign)({
                _id: result._id,
                email: result.email,
                verified: result.verified
            });
            // Send the result
            return res.status(201).json({ signature, verified: result.verified, email: result.email });
        }
        throw new error_1.CustomError('Something went wrong!', 'DeliveryPerson/DeliverySignUp');
    }
    catch (err) {
        next(err);
    }
});
exports.DeliverySignUp = DeliverySignUp;
const DeliveryLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginInputs = (0, class_transformer_1.plainToClass)(dto_1.CustomersLogin, req.body);
        const validationError = yield (0, class_validator_1.validate)(loginInputs, { validationError: { target: true } });
        if (validationError.length > 0) {
            throw new error_1.BadRequestError('Invalid Inputs!', 'DeliveryPerson/DeliveryLogin');
        }
        const { email, password } = loginInputs;
        const deliveryUser = yield models_1.DeliveryUser.findOne({ email: email });
        if (deliveryUser) {
            const validation = yield (0, utilities_1.verifyPassword)(password, deliveryUser.password);
            if (validation) {
                const signature = (0, utilities_1.generateSign)({
                    _id: deliveryUser._id,
                    email: deliveryUser.email,
                    verified: deliveryUser.verified
                });
                return res.status(200).json({
                    signature,
                    email: deliveryUser.email,
                    verified: deliveryUser.verified
                });
            }
            throw new error_1.BadRequestError('Invalid Inputs!', 'DeliveryPerson/DeliveryLogin');
        }
        throw new error_1.NotFoundError('Delivery Person Not Found!', 'DeliveryPerson/DeliveryLogin');
    }
    catch (err) {
        next(err);
    }
});
exports.DeliveryLogin = DeliveryLogin;
const GetDeliveryProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryUser = req.User;
        if (deliveryUser) {
            const profile = yield models_1.DeliveryUser.findById(deliveryUser._id);
            if (profile) {
                return res.status(201).json(profile);
            }
            throw new error_1.NotFoundError('Delivery Person Not Found!', 'DeliveryPerson/GetDeliveryProfile');
        }
        throw new error_1.BadRequestError('Delivery Person Not Found!', 'DeliveryPerson/GetDeliveryProfile');
    }
    catch (err) {
        next(err);
    }
});
exports.GetDeliveryProfile = GetDeliveryProfile;
const EditDeliveryProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryUser = req.User;
        const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerInputs, req.body);
        const validationError = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
        if (validationError.length > 0) {
            throw new error_1.BadRequestError('Invalid Inputs!', 'DeliveryPerson/EditDeliveryProfile');
        }
        const { firstName, lastName, address } = customerInputs;
        if (deliveryUser) {
            const profile = yield models_1.DeliveryUser.findById(deliveryUser._id);
            if (profile) {
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                const result = yield profile.save();
                return res.status(201).json(result);
            }
            throw new error_1.NotFoundError('Delivery Person Not Found!', 'DeliveryPerson/EditDeliveryProfile');
        }
        throw new error_1.BadRequestError('Invalid Inputs!', 'DeliveryPerson/EditDeliveryProfile');
    }
    catch (err) {
        next(err);
    }
});
exports.EditDeliveryProfile = EditDeliveryProfile;
/* ------------------- Delivery Notification --------------------- */
const UpdateDeliveryUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryUser = req.User;
        if (deliveryUser) {
            const { lat, lng } = req.body;
            const profile = yield models_1.DeliveryUser.findById(deliveryUser._id);
            if (profile) {
                if (lat && lng) {
                    profile.lat = lat;
                    profile.lng = lng;
                }
                profile.isAvailable = !profile.isAvailable;
                const result = yield profile.save();
                return res.status(201).json(result);
            }
            throw new error_1.NotFoundError('Delivery Person Not Found!', 'DeliveryPerson/UpdateDeliveryUserStatus');
        }
        throw new error_1.BadRequestError('Invalid Inputs!', 'DeliveryPerson/UpdateDeliveryUserStatus');
    }
    catch (err) {
        next(err);
    }
});
exports.UpdateDeliveryUserStatus = UpdateDeliveryUserStatus;
//# sourceMappingURL=DeliveryPersonController.js.map