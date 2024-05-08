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
exports.RestuarantsByID = exports.SearchFoods = exports.GetFoodIn30Min = exports.GetTopRestaurants = exports.GetFoodAvailability = void 0;
const models_1 = require("../models");
const error_1 = require("../error");
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']])
            .populate("foods");
        if (result.length > 0) {
            res.status(200).json(result);
        }
        throw new error_1.NotFoundError('Vendors Not Found!', 'Shopping/GetFoodAvailability');
    }
    catch (err) {
        next(err);
    }
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']])
            .limit(10);
        if (result.length > 0) {
            res.status(200).json(result);
        }
        throw new error_1.NotFoundError('Vendors Not Found!', 'Shopping/GetTopRestaurants');
    }
    catch (err) {
        next(err);
    }
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
            .populate("foods");
        if (result.length > 0) {
            let foodResult = [];
            result.map(vandor => {
                const food = vandor.foods;
                foodResult.push(...food.filter(food => food.readyTime <= 30));
            });
            res.status(200).json(foodResult);
        }
        throw new error_1.NotFoundError('Vendors Not Found!', 'Shopping/GetFoodIn30Min');
    }
    catch (err) {
        next(err);
    }
});
exports.GetFoodIn30Min = GetFoodIn30Min;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pincode = req.params.pincode;
        const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
            .populate("foods");
        if (result.length > 0) {
            let foodResult = [];
            result.map(vandor => {
                const food = vandor.foods;
                foodResult.push(...food);
            });
            res.status(200).json(foodResult);
        }
        throw new error_1.NotFoundError('Vendors Not Found!', 'Shopping/SearchFoods');
    }
    catch (err) {
        next(err);
    }
});
exports.SearchFoods = SearchFoods;
const RestuarantsByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield models_1.Vendor.findOne({ _id: id })
            .populate("foods");
        if (result) {
            res.status(200).json(result);
        }
        throw new error_1.NotFoundError('Vendors Not Found!', 'Shopping/RestuarantsByID');
    }
    catch (err) {
        next(err);
    }
});
exports.RestuarantsByID = RestuarantsByID;
//# sourceMappingURL=ShoppingController.js.map