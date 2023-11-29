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
exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.UpdateCutomerProfile = exports.CustomerProfile = exports.OTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = exports.findCustomer = void 0;
var models_1 = require("../models");
var utilities_1 = require("../utilities");
var class_transformer_1 = require("class-transformer");
var class_validator_1 = require("class-validator");
var dto_1 = require("../dto");
var order_1 = require("../models/order");
var findCustomer = function (id, email) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!email) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Customer.findOne({ email: email })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, models_1.Customer.findOne({ _id: id })];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.findCustomer = findCustomer;
var CustomerSignUp = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, inputErrors, email, password, phone, salt, userPassword, _a, otp, otp_expiry, customer, signature;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInputs, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } })];
            case 1:
                inputErrors = _b.sent();
                if (inputErrors.length > 0) {
                    return [2 /*return*/, res.status(400).json(inputErrors)];
                }
                email = customerInputs.email, password = customerInputs.password, phone = customerInputs.phone;
                return [4 /*yield*/, (0, utilities_1.generateSalt)()];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, (0, utilities_1.hashPassword)(password, salt)];
            case 3:
                userPassword = _b.sent();
                _a = (0, utilities_1.generateOtop)(), otp = _a.otp, otp_expiry = _a.otp_expiry;
                return [4 /*yield*/, models_1.Customer.create({
                        email: email,
                        password: userPassword,
                        salt: salt,
                        phone: phone,
                        otp: otp,
                        otp_expiry: otp_expiry,
                        firstName: '',
                        lastName: '',
                        address: '',
                        verified: false,
                        lat: 0,
                        lng: 0
                    })];
            case 4:
                customer = _b.sent();
                if (!customer) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, utilities_1.requestOtp)(otp, phone)];
            case 5:
                _b.sent();
                signature = (0, utilities_1.generateSign)({
                    _id: customer._id,
                    email: customer.email,
                    verified: customer.phone,
                });
                res.status(201).json(({
                    signature: signature,
                    verified: customer.verified,
                    email: customer.email
                }));
                return [3 /*break*/, 7];
            case 6:
                res.status(400).json({ err: "Something went wrong" });
                _b.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.CustomerSignUp = CustomerSignUp;
var CustomerLogin = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, inputErrors, email, password, user, validPassword, sign;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CustomersLogin, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } })];
            case 1:
                inputErrors = _a.sent();
                if (inputErrors.length > 0) {
                    return [2 /*return*/, res.status(400).json(inputErrors)];
                }
                email = customerInputs.email, password = customerInputs.password;
                if (!(email && password)) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, exports.findCustomer)('', email)];
            case 2:
                user = _a.sent();
                if (!user) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, utilities_1.verifyPassword)(password, user.password)];
            case 3:
                validPassword = _a.sent();
                if (validPassword) {
                    sign = (0, utilities_1.generateSign)({
                        _id: user._id,
                        email: user.email,
                        verified: user.phone,
                    });
                    return [2 /*return*/, res.status(200).send({ token: sign })];
                }
                return [2 /*return*/, res.status(400).send({ message: "Please enter correct email and password" })];
            case 4: return [2 /*return*/, res.status(204).send({ message: "Vendor not found" })];
            case 5: return [2 /*return*/, res.status(400).send({ message: "Please enter your email and password" })];
        }
    });
}); };
exports.CustomerLogin = CustomerLogin;
var CustomerVerify = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, otp, customerProfile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.User;
                otp = req.body.otp;
                if (!customer) return [3 /*break*/, 7];
                return [4 /*yield*/, ((0, exports.findCustomer)(customer._id, ""))];
            case 1:
                customerProfile = _a.sent();
                if (!customerProfile) return [3 /*break*/, 5];
                if (!(customerProfile.otp == otp)) return [3 /*break*/, 3];
                customerProfile.verified = true;
                return [4 /*yield*/, customerProfile.save()];
            case 2:
                _a.sent();
                res.status(200).json(customerProfile);
                return [3 /*break*/, 4];
            case 3:
                res.status(404).json({ message: "Otp Failed!" });
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(404).json({ message: "Something went wrong!" });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(404).json({ message: "Something went wrong" });
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.CustomerVerify = CustomerVerify;
var OTP = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/];
    });
}); };
exports.OTP = OTP;
var CustomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, customerProfile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.User;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, ((0, exports.findCustomer)(customer._id, ""))];
            case 1:
                customerProfile = _a.sent();
                if (customerProfile) {
                    res.status(200).json(customerProfile);
                }
                else {
                    res.status(404).json({ message: "Something went wrong!" });
                }
                return [3 /*break*/, 3];
            case 2:
                res.status(404).json({ message: "Something went wrong" });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.CustomerProfile = CustomerProfile;
var UpdateCutomerProfile = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customerInputs, inputErrors, customer, firstName, lastName, address, customerProfile, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customerInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerInputs, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } })];
            case 1:
                inputErrors = _a.sent();
                if (inputErrors.length > 0) {
                    return [2 /*return*/, res.status(400).json(inputErrors)];
                }
                customer = req.User;
                firstName = customerInputs.firstName, lastName = customerInputs.lastName, address = customerInputs.address;
                if (!customer) return [3 /*break*/, 9];
                return [4 /*yield*/, ((0, exports.findCustomer)(customer._id, ""))];
            case 2:
                customerProfile = _a.sent();
                if (!customerProfile) return [3 /*break*/, 7];
                customerProfile.firstName = firstName;
                customerProfile.lastName = lastName;
                customerProfile.address = address;
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, customerProfile.save()];
            case 4:
                _a.sent();
                res.status(200).json(customerProfile);
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error('Database error:', error_1);
                res.status(500).json({ message: 'Internal server error' });
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(404).json({ message: "Something went wrong!" });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(404).json({ message: "Something went wrong" });
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.UpdateCutomerProfile = UpdateCutomerProfile;
/* ------------------- Order Section --------------------- */
// const validateTransaction = async(txnId: string) => {
//     const currentTransaction = await Transaction.findById(txnId)
//     if(currentTransaction){
//         if(currentTransaction.status.toLowerCase() !== 'failed'){
//             return {status: true, currentTransaction}
//         }
//     }
//     return {status: false, currentTransaction}
// }
var CreateOrder = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, _a, txnId, amount, items, profile, orderId, cart_1, cartItems_1, netAmount_1, vendorId_1, foods, currentOrder, profileResponse;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = req.User;
                _a = req.body, txnId = _a.txnId, amount = _a.amount, items = _a.items;
                if (!customer) return [3 /*break*/, 5];
                return [4 /*yield*/, models_1.Customer.findById(customer._id)];
            case 1:
                profile = _b.sent();
                orderId = "".concat(Math.floor(Math.random() * 89999) + 1000);
                cart_1 = req.body;
                cartItems_1 = Array();
                netAmount_1 = 0.0;
                return [4 /*yield*/, models_1.Food.find().where('_id').in(cart_1.map(function (item) { return item._id; })).exec()];
            case 2:
                foods = _b.sent();
                foods.map(function (food) {
                    cart_1.map(function (_a) {
                        var _id = _a._id, unit = _a.unit;
                        if (food._id == _id) {
                            vendorId_1 = food.vendorId;
                            netAmount_1 += (food.price * unit);
                            cartItems_1.push({ food: food, unit: unit });
                        }
                    });
                });
                if (!cartItems_1) return [3 /*break*/, 5];
                return [4 /*yield*/, order_1.Order.create({
                        orderId: orderId,
                        vendorId: vendorId_1,
                        items: cartItems_1,
                        totalAmount: netAmount_1,
                        paidAmount: amount,
                        orderDate: new Date(),
                        orderStatus: 'Waiting',
                        remarks: '',
                        deliveryId: '',
                        readyTime: 45
                    })];
            case 3:
                currentOrder = _b.sent();
                profile.cart = [];
                profile.orders.push(currentOrder);
                return [4 /*yield*/, profile.save()];
            case 4:
                profileResponse = _b.sent();
                return [2 /*return*/, res.status(200).json(profileResponse)];
            case 5: return [2 /*return*/, res.status(400).json({ msg: 'Error while Creating Order' })];
        }
    });
}); };
exports.CreateOrder = CreateOrder;
var GetOrders = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                customer = req.User;
                if (!customer) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Customer.findById(customer._id).populate("orders")];
            case 1:
                profile = _a.sent();
                if (profile) {
                    return [2 /*return*/, res.status(200).json(profile.orders)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.status(400).json({ msg: 'Orders not found' })];
        }
    });
}); };
exports.GetOrders = GetOrders;
var GetOrderById = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var orderId, order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                orderId = req.params.id;
                if (!orderId) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Customer.findById(orderId).populate("items.food")];
            case 1:
                order = _a.sent();
                if (order) {
                    return [2 /*return*/, res.status(200).json(order)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.status(400).json({ msg: 'Order not found' })];
        }
    });
}); };
exports.GetOrderById = GetOrderById;
//# sourceMappingURL=CustomerController.js.map