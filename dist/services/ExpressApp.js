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
const express_1 = __importDefault(require("express"));
const routes_1 = require("../routes");
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const utilities_1 = require("../utilities");
const middlewares_1 = require("../middlewares");
exports.default = (app) => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.set('trust proxy', 1);
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    }));
    app.use(express_1.default.json());
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use((0, xss_clean_1.default)());
    app.use('/images', express_1.default.static(path_1.default.join(__dirname, '/images')));
    app.use("/admin", routes_1.AdminRoute);
    app.use("/vendor", routes_1.VendorRoute);
    app.use("/shopping", routes_1.ShoppingRoute);
    app.use("/customer", routes_1.CustomerRoute);
    app.use("/deliveryPerson", routes_1.DeliveryRoute);
    //Error Middleware
    app.use(middlewares_1.errorHandlerMiddleware);
    // app.use(ErrorHandler)
    //Document
    app.get('*', (req, res, next) => {
        const postmanDocURL = 'https://documenter.getpostman.com/view/22277285/2s9YeN2U1H';
        res.send(utilities_1.html);
    });
    return app;
});
//# sourceMappingURL=ExpressApp.js.map