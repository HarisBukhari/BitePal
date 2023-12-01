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
const GetFoodAvailability = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .populate("foods");
    if (result.length > 0) {
        res.status(200).json(result);
    }
    else {
        res.status(400).json({ message: "No Data Available" });
    }
});
exports.GetFoodAvailability = GetFoodAvailability;
const GetTopRestaurants = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pincode = req.params.pincode;
    const result = yield models_1.Vendor.find({ pincode: pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .limit(10);
    if (result.length > 0) {
        res.status(200).json(result);
    }
    else {
        res.status(400).json({ message: "No Data Available" });
    }
});
exports.GetTopRestaurants = GetTopRestaurants;
const GetFoodIn30Min = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    else {
        res.status(400).json({ message: "No Data Available" });
    }
});
exports.GetFoodIn30Min = GetFoodIn30Min;
const SearchFoods = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    else {
        res.status(400).json({ message: "No Data Available" });
    }
});
exports.SearchFoods = SearchFoods;
const RestuarantsByID = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield models_1.Vendor.findOne({ _id: id })
        .populate("foods");
    if (result) {
        res.status(200).json(result);
    }
    else {
        res.status(400).json({ message: "No Data Available" });
    }
});
exports.RestuarantsByID = RestuarantsByID;
//# sourceMappingURL=ShoppingController.js.map