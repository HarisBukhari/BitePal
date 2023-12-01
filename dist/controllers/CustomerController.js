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
exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.UpdateCutomerProfile = exports.CustomerProfile = exports.OTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = exports.findCustomer = void 0;
const models_1 = require("../models");
const utilities_1 = require("../utilities");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const dto_1 = require("../dto");
const order_1 = require("../models/order");
const findCustomer = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    if (email) {
        return yield models_1.Customer.findOne({ email: email });
    }
    else {
        return yield models_1.Customer.findOne({ _id: id });
    }
});
exports.findCustomer = findCustomer;
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password, phone } = customerInputs;
    const salt = yield (0, utilities_1.generateSalt)();
    const userPassword = yield (0, utilities_1.hashPassword)(password, salt);
    const { otp, otp_expiry } = (0, utilities_1.generateOtop)();
    const customer = yield models_1.Customer.create({
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
    });
    if (customer) {
        yield (0, utilities_1.requestOtp)(otp, phone);
        const signature = (0, utilities_1.generateSign)({
            _id: customer._id,
            email: customer.email,
            verified: customer.phone,
        });
        res.status(201).json(({
            signature: signature,
            verified: customer.verified,
            email: customer.email
        }));
    }
    else {
        res.status(400).json({ err: "Something went wrong" });
    }
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CustomersLogin, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const { email, password } = customerInputs;
    if (email && password) {
        const user = yield (0, exports.findCustomer)('', email);
        if (user) {
            let validPassword = yield (0, utilities_1.verifyPassword)(password, user.password);
            if (validPassword) {
                const sign = (0, utilities_1.generateSign)({
                    _id: user._id,
                    email: user.email,
                    verified: user.phone,
                });
                return res.status(200).send({ token: sign });
            }
            return res.status(400).send({ message: "Please enter correct email and password" });
        }
        return res.status(204).send({ message: "Vendor not found" });
    }
    return res.status(400).send({ message: "Please enter your email and password" });
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.User;
    const { otp } = req.body;
    if (customer) {
        const customerProfile = yield ((0, exports.findCustomer)(customer._id, ""));
        if (customerProfile) {
            if (customerProfile.otp == otp) {
                customerProfile.verified = true;
                yield customerProfile.save();
                res.status(200).json(customerProfile);
            }
            else {
                res.status(404).json({ message: "Otp Failed!" });
            }
        }
        else {
            res.status(404).json({ message: "Something went wrong!" });
        }
    }
    else {
        res.status(404).json({ message: "Something went wrong" });
    }
});
exports.CustomerVerify = CustomerVerify;
const OTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.OTP = OTP;
const CustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.User;
    if (customer) {
        const customerProfile = yield ((0, exports.findCustomer)(customer._id, ""));
        if (customerProfile) {
            res.status(200).json(customerProfile);
        }
        else {
            res.status(404).json({ message: "Something went wrong!" });
        }
    }
    else {
        res.status(404).json({ message: "Something went wrong" });
    }
});
exports.CustomerProfile = CustomerProfile;
const UpdateCutomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerInputs, req.body);
    const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }
    const customer = req.User;
    const { firstName, lastName, address } = customerInputs;
    if (customer) {
        const customerProfile = yield ((0, exports.findCustomer)(customer._id, ""));
        if (customerProfile) {
            customerProfile.firstName = firstName;
            customerProfile.lastName = lastName;
            customerProfile.address = address;
            try {
                yield customerProfile.save();
                res.status(200).json(customerProfile);
            }
            catch (error) {
                console.error('Database error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        else {
            res.status(404).json({ message: "Something went wrong!" });
        }
    }
    else {
        res.status(404).json({ message: "Something went wrong" });
    }
});
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
const CreateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.User;
        const { txnId, amount, items } = req.body;
        if (customer) {
            // const { status, currentTransaction } =  await validateTransaction(txnId)
            // if(!status){
            //     return res.status(404).json({ message: 'Error while Creating Order!'})
            // }
            const profile = yield models_1.Customer.findById(customer._id);
            const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
            const cart = req.body;
            let cartItems = Array();
            let netAmount = 0.0;
            let vendorId;
            const foods = yield models_1.Food.find().where('_id').in(cart.map(item => item._id)).exec();
            foods.map(food => {
                cart.map(({ _id, unit }) => {
                    if (food._id == _id) {
                        vendorId = food.vendorId;
                        netAmount += (food.price * unit);
                        cartItems.push({ food, unit });
                    }
                });
            });
            if (cartItems) {
                const currentOrder = yield order_1.Order.create({
                    orderId: orderId,
                    vendorId: vendorId,
                    items: cartItems,
                    totalAmount: netAmount,
                    paidAmount: amount,
                    orderDate: new Date(),
                    orderStatus: 'Waiting',
                    remarks: '',
                    deliveryId: '',
                    readyTime: 45
                });
                profile.cart = [];
                profile.orders.push(currentOrder);
                // currentTransaction.vendorId = vendorId
                // currentTransaction.orderId = orderId
                // currentTransaction.status = 'CONFIRMED'
                // await currentTransaction.save()
                // await assignOrderForDelivery(currentOrder._id, vendorId)
                const profileResponse = yield profile.save();
                return res.status(200).json(profileResponse);
            }
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    return res.status(400).json({ msg: 'Error while Creating Order' });
});
exports.CreateOrder = CreateOrder;
const GetOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = req.User;
    if (customer) {
        const profile = yield models_1.Customer.findById(customer._id).populate("orders");
        if (profile) {
            return res.status(200).json(profile.orders);
        }
    }
    return res.status(400).json({ msg: 'Orders not found' });
});
exports.GetOrders = GetOrders;
const GetOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    if (orderId) {
        const order = yield models_1.Customer.findById(orderId).populate("items.food");
        if (order) {
            return res.status(200).json(order);
        }
    }
    return res.status(400).json({ msg: 'Order not found' });
});
exports.GetOrderById = GetOrderById;
//# sourceMappingURL=CustomerController.js.map