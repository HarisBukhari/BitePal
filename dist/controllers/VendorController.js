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
exports.EditOffer = exports.AddOffer = exports.GetOffers = exports.GetVendorTransactions = exports.ProcessOrder = exports.GetOrderDetails = exports.GetCurrentOrders = exports.getFoods = exports.addFood = exports.updateVendorImage = exports.updateVendorService = exports.updateVendor = exports.getVendor = exports.login = void 0;
const _1 = require(".");
const utilities_1 = require("../utilities");
const models_1 = require("../models");
const error_1 = require("../error");
const Redis_1 = require("../services/Redis");
/* ------------------- Vendor Profile Section --------------------- */
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = yield (0, _1.findVendor)('', email);
            if (user) {
                let validPassword = yield (0, utilities_1.verifyPassword)(password, user.password);
                if (validPassword) {
                    const sign = (0, utilities_1.generateSign)({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        foodType: user.foodType
                    });
                    return res.status(200).send({ token: sign });
                }
                throw new error_1.CustomError('Invalid Inputs', 'Vendor/VendorLogin');
            }
            throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/VendorLogin');
        }
        throw new error_1.BadRequestError('Please enter your email and password', 'Vendor/VendorLogin');
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const getVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = req.User;
        console.log(vendor);
        if (vendor) {
            const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
            if (vendorProfile) {
                res.status(200).json(vendorProfile);
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/getVendor');
        }
        throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/getVendor');
    }
    catch (err) {
        next(err);
    }
});
exports.getVendor = getVendor;
const updateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = req.User;
        const { address, foodType, name, phone } = req.body;
        if (vendor) {
            const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
            if (vendorProfile) {
                vendorProfile.foodType = foodType;
                vendorProfile.name = name;
                vendorProfile.address = address;
                vendorProfile.phone = phone;
                yield vendorProfile.save();
                res.status(200).json(vendorProfile);
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/updateVendor');
        }
        throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/updateVendor');
    }
    catch (err) {
        next(err);
    }
});
exports.updateVendor = updateVendor;
const updateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = req.User;
        const { lat, lng } = req.body;
        if (vendor) {
            const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
            if (vendorProfile) {
                vendorProfile.serviceAvailable = !vendorProfile.serviceAvailable;
                vendorProfile.lat = lat;
                vendorProfile.lng = lng;
                yield vendorProfile.save();
                res.status(200).json(vendorProfile);
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/updateVendorService');
        }
        throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/updateVendorService');
    }
    catch (err) {
        next(err);
    }
});
exports.updateVendorService = updateVendorService;
const updateVendorImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = req.User;
        if (vendor) {
            const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
            if (vendorProfile) {
                const files = req.files;
                const images = files.map((file) => file.filename);
                vendorProfile.coverImage.push(...images);
                yield vendorProfile.save();
                return res.status(201).json({ "success": vendorProfile });
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/updateVendorImage');
        }
        throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/updateVendorImage');
    }
    catch (err) {
        next(err);
    }
});
exports.updateVendorImage = updateVendorImage;
/* ------------------- Vendor Food Section --------------------- */
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = req.User;
        if (vendor) {
            const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
            if (vendorProfile) {
                //Here
                const { name, category, description, foodType, price, readyTime } = req.body;
                const files = req.files;
                const images = files.map((file) => file.filename);
                const food = yield models_1.Food.create({
                    vendorId: vendorProfile._id,
                    name: name,
                    category: category,
                    description: description,
                    foodType: foodType,
                    price: price,
                    readyTime: readyTime,
                    rating: 0,
                    image: images
                });
                vendorProfile.foods.push(food);
                yield vendorProfile.save();
                return res.status(201).json({ "success": vendorProfile });
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/addFood');
        }
        throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/addFood');
    }
    catch (err) {
        next(err);
    }
});
exports.addFood = addFood;
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = req.User;
        if (vendor) {
            const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
            if (vendorProfile) {
                const foods = yield models_1.Food.find({ vendorId: vendorProfile.id });
                if (foods.length > 0) {
                    const cacheValue = yield (0, Redis_1.get)('foods');
                    if (cacheValue) {
                        return res.status(200).json(JSON.parse(cacheValue));
                    }
                    yield (0, Redis_1.set)('data', JSON.stringify(foods), 30);
                    return res.status(200).json(foods);
                }
                else {
                    return res.status(404).json({ message: '404 what else you can expect' });
                }
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/getFoods');
        }
        throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/getFoods');
    }
    catch (err) {
        next(err);
    }
});
exports.getFoods = getFoods;
/* ------------------- Vendor Order Section --------------------- */
const GetCurrentOrders = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.User;
        if (user) {
            const orders = yield models_1.Order.find({ vendorId: user._id }).populate('items.food');
            if (orders != null) {
                return res.status(200).json(orders);
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/GetCurrentOrders');
        }
        throw new error_1.NotFoundError('Orders Not Found', 'Vendor/GetCurrentOrders');
    }
    catch (err) {
        next(err);
    }
});
exports.GetCurrentOrders = GetCurrentOrders;
const GetOrderDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        if (orderId) {
            const order = yield models_1.Order.findById(orderId).populate('items.food');
            if (order != null) {
                return res.status(200).json(order);
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/GetOrderDetails');
        }
        throw new error_1.NotFoundError('Orders Not Found', 'Vendor/GetOrderDetails');
    }
    catch (err) {
        next(err);
    }
});
exports.GetOrderDetails = GetOrderDetails;
const ProcessOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        const { status, remarks, time } = req.body;
        const validOrder = yield models_1.Order.findById(orderId).populate('food');
        if (validOrder) {
            validOrder.orderStatus = status;
            validOrder.remarks = remarks;
            if (time) {
                validOrder.readyTime = time;
            }
            const orderResult = yield validOrder.save();
            if (orderResult != null) {
                return res.status(200).json(orderResult);
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/ProcessOrder');
        }
        throw new error_1.NotFoundError('Orders Not Found', 'Vendor/ProcessOrder');
    }
    catch (err) {
        next(err);
    }
});
exports.ProcessOrder = ProcessOrder;
/* ------------------- Vendor Transaction Section --------------------- */
const GetVendorTransactions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = req.User;
        if (vendor) {
            const transactions = yield models_1.Transaction.find({ vendorId: vendor._id });
            if (transactions) {
                return res.status(200).json(transactions);
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/GetVendorTransactions');
        }
        throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/GetVendorTransactions');
    }
    catch (err) {
        next(err);
    }
});
exports.GetVendorTransactions = GetVendorTransactions;
/* ------------------- Vendor Offer Section --------------------- */
const GetOffers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.User;
        if (user) {
            let currentOffer = Array();
            const offers = yield models_1.Offer.find().populate('vendors');
            if (offers) {
                offers.map(item => {
                    if (item.vendors) {
                        item.vendors.map(vendor => {
                            if (vendor._id.toString() === user._id) {
                                currentOffer.push(item);
                            }
                        });
                    }
                    if (item.offerType === "GENERIC") {
                        currentOffer.push(item);
                    }
                });
            }
            throw new error_1.CustomError('Something Went Wrong', 'Vendor/GetOffers');
        }
        throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/GetOffers');
    }
    catch (err) {
        next(err);
    }
});
exports.GetOffers = GetOffers;
const AddOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vendor = req.User;
        if (vendor) {
            const { title, description, offerType, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = req.body;
            const validVendor = yield (0, _1.findVendor)(vendor._id);
            if (validVendor) {
                const offer = yield models_1.Offer.create({
                    title,
                    description,
                    offerType,
                    offerAmount,
                    pincode,
                    promoType,
                    startValidity,
                    endValidity,
                    bank,
                    isActive,
                    minValue,
                    vendors: [vendor]
                });
                if (offer) {
                    return res.status(200).json(offer);
                }
                throw new error_1.CustomError('Something Went Wrong', 'Vendor/AddOffer');
            }
            throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/AddOffer');
        }
        throw new error_1.BadRequestError('Invalid Inputs', 'Vendor/AddOffer');
    }
    catch (err) {
        next(err);
    }
});
exports.AddOffer = AddOffer;
const EditOffer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.User;
        const offerId = req.params.id;
        if (user) {
            const { title, description, offerType, offerAmount, pincode, promocode, promoType, startValidity, endValidity, bank, bins, minValue, isActive } = req.body;
            const currentOffer = yield models_1.Offer.findById(offerId);
            if (currentOffer) {
                const vendor = yield (0, _1.findVendor)(user._id);
                if (vendor) {
                    currentOffer.title = title,
                        currentOffer.description = description,
                        currentOffer.offerType = offerType,
                        currentOffer.offerAmount = offerAmount,
                        currentOffer.pincode = pincode,
                        currentOffer.promoType = promoType,
                        currentOffer.startValidity = startValidity,
                        currentOffer.endValidity = endValidity,
                        currentOffer.bank = bank,
                        currentOffer.isActive = isActive,
                        currentOffer.minValue = minValue;
                    const result = yield currentOffer.save();
                    if (result) {
                        return res.status(200).json(result);
                    }
                    throw new error_1.CustomError('Something Went Wrong', 'Vendor/EditOffer');
                }
                throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/EditOffer');
            }
            throw new error_1.NotFoundError('Vendor Not Found', 'Vendor/EditOffer');
        }
        throw new error_1.BadRequestError('Invalid Inputs', 'Vendor/EditOffer');
    }
    catch (err) {
        next(err);
    }
});
exports.EditOffer = EditOffer;
//# sourceMappingURL=VendorController.js.map