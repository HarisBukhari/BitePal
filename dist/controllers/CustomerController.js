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
exports.CreatePayment = exports.VerifyOffer = exports.GetCustomerTransactions = exports.GetOrderById = exports.GetOrders = exports.CreateOrder = exports.DeleteCart = exports.GetCart = exports.AddToCart = exports.UpdateCutomerProfile = exports.CustomerProfile = exports.OTP = exports.CustomerVerify = exports.CustomerLogin = exports.CustomerSignUp = exports.findCustomer = void 0;
const models_1 = require("../models");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const utilities_1 = require("../utilities");
const dto_1 = require("../dto");
const error_1 = require("../error");
/* ------------------- Customer Profile Section --------------------- */
const findCustomer = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (email) {
            return yield models_1.Customer.findOne({ email: email });
        }
        if (id) {
            return yield models_1.Customer.findOne({ _id: id });
        }
        throw new error_1.BadRequestError('Invalid inputs', 'Customer/findCustomer');
    }
    catch (err) {
        if (err instanceof error_1.BadRequestError) {
            throw err;
        }
        throw new error_1.CustomError('An unexpected error occurred', 'Customer/findCustomer');
    }
});
exports.findCustomer = findCustomer;
const CustomerSignUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateCustomerInputs, req.body);
        const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
        if (inputErrors.length > 0) {
            throw new error_1.BadRequestError('Input validation error', 'Customer/SignUp');
        }
        const { email, password, phone } = customerInputs;
        const salt = yield (0, utilities_1.generateSalt)();
        const userPassword = yield (0, utilities_1.hashPassword)(password, salt);
        const user = yield (0, exports.findCustomer)('', email);
        if (user !== null) {
            throw new error_1.BadRequestError('A Customer exist with the provided email ID', 'Customer/SignUp');
        }
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
                verified: false,
            });
            res.status(201).json(({
                signature: signature,
                verified: customer.verified,
                email: customer.email
            }));
        }
        else {
            throw new error_1.CustomError('Database Error', 'Customer/Signup');
        }
    }
    catch (err) {
        next(err);
    }
});
exports.CustomerSignUp = CustomerSignUp;
const CustomerLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.CustomersLogin, req.body);
        const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
        if (inputErrors.length > 0) {
            throw new error_1.BadRequestError('Input validation error', 'Customer/CustomerLogin');
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
                        verified: false,
                    });
                    return res.status(200).send({ token: sign });
                }
                throw new error_1.BadRequestError('Input validation error', 'Customer/CustomerLogin');
            }
            throw new error_1.NotFoundError('Input validation error', 'Customer/CustomerLogin');
        }
        throw new error_1.BadRequestError('Input validation error', 'Customer/CustomerLogin');
    }
    catch (err) {
        next(err);
    }
});
exports.CustomerLogin = CustomerLogin;
const CustomerVerify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
                throw new error_1.BadRequestError('Otp Failed', 'Customer/CustomerVerify');
            }
            throw new error_1.NotFoundError('Customer not Found', 'Customer/CustomerVerify');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/CustomerVerify');
    }
    catch (err) {
        next(err);
    }
});
exports.CustomerVerify = CustomerVerify;
const OTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.User;
        if (customer) {
            const customerProfile = yield ((0, exports.findCustomer)(customer._id, ""));
            if (customerProfile) {
                const { otp, otp_expiry } = (0, utilities_1.generateOtop)();
                const result = yield (0, utilities_1.requestOtp)(otp, customerProfile.phone);
                customerProfile.otp = otp;
                customerProfile.otp_expiry = otp_expiry;
                yield customerProfile.save();
                res.status(200).json(customerProfile.otp);
            }
            throw new error_1.NotFoundError('Customer not Found', 'Customer/Otp');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/Otp');
    }
    catch (err) {
        next(err);
    }
});
exports.OTP = OTP;
const CustomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.User;
        if (customer) {
            const customerProfile = yield ((0, exports.findCustomer)(customer._id, ""));
            if (customerProfile) {
                res.status(200).json(customerProfile);
            }
            throw new error_1.NotFoundError('Customer not Found', 'Customer/CustomerProfile');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/CustomerProfile');
    }
    catch (err) {
        next(err);
    }
});
exports.CustomerProfile = CustomerProfile;
const UpdateCutomerProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customerInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerInputs, req.body);
        const inputErrors = yield (0, class_validator_1.validate)(customerInputs, { validationError: { target: true } });
        if (inputErrors.length > 0) {
            throw new error_1.BadRequestError('Invalid inputs', 'Customer/UpdateCutomerProfile');
        }
        const customer = req.User;
        const { firstName, lastName, address } = customerInputs;
        if (customer) {
            const customerProfile = yield ((0, exports.findCustomer)(customer._id, ""));
            if (customerProfile) {
                customerProfile.firstName = firstName;
                customerProfile.lastName = lastName;
                customerProfile.address = address;
                yield customerProfile.save();
                res.status(200).json(customerProfile);
            }
            throw new error_1.NotFoundError('Customer not found', 'Customer/UpdateCutomerProfile');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/UpdateCutomerProfile');
    }
    catch (err) {
        next(err);
    }
});
exports.UpdateCutomerProfile = UpdateCutomerProfile;
/* ------------------- Cart Section --------------------- */
const AddToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.User;
        if (customer) {
            const profile = yield models_1.Customer.findById(customer._id);
            let cartItems = Array();
            const { _id, unit } = req.body;
            const food = yield models_1.Food.findById(_id);
            if (food) {
                if (profile != null) {
                    cartItems = profile.cart;
                    if (cartItems.length > 0) {
                        // check and update
                        let existFoodItems = cartItems.filter((item) => item.food._id.toString() === _id);
                        if (existFoodItems.length > 0) {
                            const index = cartItems.indexOf(existFoodItems[0]);
                            if (unit > 0) {
                                cartItems[index] = { food, unit };
                            }
                            else {
                                cartItems.splice(index, 1);
                            }
                        }
                        else {
                            cartItems.push({ food, unit });
                        }
                    }
                    else {
                        // add new Item
                        cartItems.push({ food, unit });
                    }
                    if (cartItems) {
                        profile.cart = cartItems;
                        const cartResult = yield profile.save();
                        return res.status(200).json(cartResult.cart);
                    }
                    throw new error_1.CustomError('Unable to add to cart!', 'Customer/AddtoCart');
                }
                throw new error_1.NotFoundError('Customer not found', 'Customer/AddtoCart');
            }
            throw new error_1.NotFoundError('Food not found', 'Customer/AddtoCart');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/AddtoCart');
    }
    catch (err) {
        next(err);
    }
});
exports.AddToCart = AddToCart;
const GetCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.User;
        if (customer) {
            const profile = yield models_1.Customer.findById(customer._id);
            if (profile) {
                return res.status(200).json(profile.cart);
            }
            throw new error_1.NotFoundError('Customer not found', 'Customer/GetCart');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/GetCart');
    }
    catch (err) {
        next(err);
    }
});
exports.GetCart = GetCart;
const DeleteCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.User;
        if (customer) {
            const profile = yield models_1.Customer.findById(customer._id).populate('cart.food');
            if (profile != null) {
                profile.cart = [];
                const cartResult = yield profile.save();
                return res.status(200).json(cartResult);
            }
            throw new error_1.NotFoundError('Customer not found', 'Customer/DeleteCart');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/DeleteCart');
    }
    catch (err) {
        next(err);
    }
});
exports.DeleteCart = DeleteCart;
/* ------------------- Order Section --------------------- */
const validateTransaction = (txnId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentTransaction = yield models_1.Transaction.findById(txnId);
        if (currentTransaction) {
            if (currentTransaction.status.toLowerCase() !== 'failed') {
                return { status: true, currentTransaction };
            }
        }
        return { status: false, currentTransaction };
    }
    catch (err) {
        throw new error_1.CustomError('Database Error', 'Customer/validateTransaction');
    }
});
const CreateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.User;
        const { txnId, amount, items } = req.body;
        if (customer) {
            const { status, currentTransaction } = yield validateTransaction(txnId);
            if (!status) {
                throw new error_1.BadRequestError('Error while creating Order', 'Customer/createOrder');
            }
            const profile = yield models_1.Customer.findById(customer._id);
            const orderId = `${Math.floor(Math.random() * 89999) + 1000}`;
            const cart = items;
            let cartItems = Array();
            let netAmount = 0.0;
            let vendorId;
            const foods = yield models_1.Food.find().where('_id').in(cart.map(item => item._id));
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
                const currentOrder = yield models_1.Order.create({
                    orderId: orderId,
                    vendorId: vendorId,
                    items: cartItems,
                    totalAmount: netAmount,
                    paidAmount: amount,
                    orderDate: new Date(),
                    orderStatus: 'Pending',
                    remarks: '',
                    deliveryId: '',
                    readyTime: 45
                });
                profile.cart = [];
                profile.orders.push(currentOrder);
                currentTransaction.vendorId = vendorId;
                currentTransaction.orderId = orderId;
                currentTransaction.status = 'CONFIRMED';
                yield currentTransaction.save();
                yield assignOrderForDelivery(currentOrder._id, vendorId);
                const profileResponse = yield profile.save();
                return res.status(200).json(currentTransaction);
            }
            throw new error_1.CustomError('Cart items not found', 'Customer/CreateOrder');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/CreateOrder');
    }
    catch (err) {
        next(err);
    }
});
exports.CreateOrder = CreateOrder;
const GetOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.User;
        if (customer) {
            const profile = yield models_1.Customer.findById(customer._id).populate("orders");
            if (profile) {
                return res.status(200).json(profile.orders);
            }
            throw new error_1.NotFoundError('Customer not found', 'Customer/GetOrders');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/GetOrders');
    }
    catch (err) {
        next(err);
    }
});
exports.GetOrders = GetOrders;
const GetOrderById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        if (orderId) {
            const order = yield models_1.Order.findById(orderId).populate("items.food");
            if (order) {
                return res.status(200).json(order);
            }
        }
        throw new error_1.BadRequestError('Invalid Order ID', 'Customer/GetOrderById');
    }
    catch (err) {
        next(err);
    }
    return res.status(400).json({ msg: 'Order not found' });
});
exports.GetOrderById = GetOrderById;
const GetCustomerTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.User;
        if (customer) {
            const transactions = yield models_1.Transaction.find({ customer: customer._id });
            if (transactions) {
                return res.status(200).json(transactions);
            }
            throw new error_1.NotFoundError('Transaction not found', 'Customer/GetCustomerTransactions');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/GetCustomerTransactions');
    }
    catch (err) {
        next(err);
    }
});
exports.GetCustomerTransactions = GetCustomerTransactions;
/* ------------------- Verify Offer Section --------------------- */
const VerifyOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const offerId = req.params.id;
        const customer = req.User;
        if (customer) {
            const appliedOffer = yield models_1.Offer.findById(offerId);
            if (appliedOffer) {
                if (appliedOffer.isActive) {
                    return res.status(200).json({ message: 'Offer is Valid', offer: appliedOffer });
                }
            }
            throw new error_1.NotFoundError('Applied offer not found', 'Customer/VerifyOffer');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/VerifyOffer');
    }
    catch (err) {
        next(err);
    }
});
exports.VerifyOffer = VerifyOffer;
/* ------------------- Transaction Section --------------------- */
const CreatePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = req.User;
        if (customer) {
            const { amount, paymentMode, offerId } = req.body;
            let payableAmount = Number(amount);
            if (offerId) {
                const appliedOffer = yield models_1.Offer.findById(offerId).populate('vendors');
                if (appliedOffer.isActive) {
                    payableAmount = (payableAmount - appliedOffer.offerAmount);
                }
            }
            // perform payment gateway charge api
            // create record on transaction
            const transaction = yield models_1.Transaction.create({
                customer: customer._id,
                vendorId: '',
                orderId: '',
                orderValue: payableAmount,
                offerUsed: offerId || 'NA',
                status: 'OPEN',
                paymentMode: paymentMode,
                paymentResponse: 'Payment is cash on Delivery'
            });
            //return transaction
            if (transaction) {
                return res.status(200).json(transaction);
            }
            throw new error_1.CustomError('Error creating transaction', 'Customer/CreatePayment');
        }
        throw new error_1.BadRequestError('Invalid Customer', 'Customer/CreatePayment');
    }
    catch (err) {
        next(err);
    }
});
exports.CreatePayment = CreatePayment;
const assignOrderForDelivery = (orderId, vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find the vendor
        const vendor = yield models_1.Vendor.findById(vendorId);
        if (vendor) {
            const areaCode = vendor.pincode;
            const vendorLat = vendor.lat;
            const vendorLng = vendor.lng;
            //find the available Delivery person
            const deliveryPerson = yield models_1.DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true });
            if (deliveryPerson) {
                // Check the nearest delivery person and assign the order
                const currentOrder = yield models_1.Order.findById(orderId);
                if (currentOrder) {
                    //update Delivery ID
                    currentOrder.deliveryId = deliveryPerson[0]._id;
                    yield currentOrder.save();
                    //Notify to vendor for received new order firebase push notification
                }
            }
            throw new error_1.CustomError('Delivery Person not found', 'Customer/assignOrderDelivery');
        }
        throw new error_1.CustomError('Vendor not found', 'Customer/assignOrderDelivery');
    }
    catch (err) {
        if (err instanceof error_1.CustomError) {
            throw err;
        }
        throw new Error('An unexpected error occurred');
    }
});
//# sourceMappingURL=CustomerController.js.map