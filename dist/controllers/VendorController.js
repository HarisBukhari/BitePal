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
exports.getFoods = exports.addFood = exports.updateVendorImage = exports.updateVendorService = exports.updateVendor = exports.getVendor = exports.login = void 0;
const _1 = require(".");
const utilities_1 = require("../utilities");
const food_1 = require("../models/food");
//Vendor Controller
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
            return res.status(400).send({ message: "Please enter correct email and password" });
        }
        return res.status(204).send({ message: "Vendor not found" });
    }
    return res.status(400).send({ message: "Please enter your email and password" });
});
exports.login = login;
const getVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = req.User;
    console.log(vendor);
    if (vendor) {
        const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
        if (vendorProfile) {
            res.status(200).json(vendorProfile);
        }
        else {
            res.status(404).json({ message: "Something went wrong" });
        }
    }
    else {
        res.status(404).json({ message: "Something went wrong" });
    }
});
exports.getVendor = getVendor;
const updateVendor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = req.User;
    const { address, foodType, name, phone } = req.body;
    if (vendor) {
        const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
        if (vendorProfile) {
            vendorProfile.foodType = foodType;
            vendorProfile.name = name;
            vendorProfile.address = address;
            vendorProfile.phone = phone;
            try {
                yield vendorProfile.save();
                res.status(200).json(vendorProfile);
            }
            catch (error) {
                console.error('Database error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        else {
            res.status(404).json({ message: "Something went wrong" });
        }
    }
    else {
        res.status(404).json({ message: "Something went wrong" });
    }
});
exports.updateVendor = updateVendor;
const updateVendorService = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = req.User;
    if (vendor) {
        const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
        if (vendorProfile) {
            vendorProfile.serviceAvailable = !vendorProfile.serviceAvailable;
            try {
                yield vendorProfile.save();
                res.status(200).json(vendorProfile);
            }
            catch (error) {
                console.error('Database error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        else {
            res.status(404).json({ message: "Something went wrong" });
        }
    }
    else {
        res.status(404).json({ message: "Something went wrong" });
    }
});
exports.updateVendorService = updateVendorService;
const updateVendorImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = req.User;
    if (vendor) {
        const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
        if (vendorProfile) {
            //Here
            try {
                const files = req.files;
                const images = files.map((file) => file.filename);
                vendorProfile.coverImage.push(...images);
                yield vendorProfile.save();
                return res.status(201).json({ "success": vendorProfile });
            }
            catch (error) {
                console.error('Database error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        else {
            res.status(404).json({ message: "Something went wrong" });
        }
    }
    else {
        res.status(404).json({ message: "Something went wrong" });
    }
});
exports.updateVendorImage = updateVendorImage;
//Food Controller
const addFood = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = req.User;
    if (vendor) {
        const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
        if (vendorProfile) {
            //Here
            const { name, category, description, foodType, price, readyTime } = req.body;
            try {
                const files = req.files;
                const images = files.map((file) => file.filename);
                const food = yield food_1.Food.create({
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
            catch (error) {
                console.error('Database error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        else {
            res.status(404).json({ message: "Something went wrong" });
        }
    }
    else {
        res.status(404).json({ message: "Something went wrong" });
    }
});
exports.addFood = addFood;
const getFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = req.User;
    if (vendor) {
        const vendorProfile = yield ((0, _1.findVendor)(vendor._id, ""));
        if (vendorProfile) {
            try {
                const foods = yield food_1.Food.find({ vendorId: vendorProfile.id });
                if (foods.length > 0) {
                    res.status(200).json(foods);
                }
                else {
                    res.status(404).json({ message: '404 what else you can expect' });
                }
            }
            catch (err) {
                console.error('Database error:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        }
        else {
            res.status(404).json({ message: "! Something went wrong" });
        }
    }
});
exports.getFoods = getFoods;
//# sourceMappingURL=VendorController.js.map