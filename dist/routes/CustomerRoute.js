"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.CustomerRoute = router;
router.get('/', (req, res, next) => {
    return res.json({ "data": "Hello From Admin!" });
});
/* ------------------- Login/SignUp Section --------------------- */
router.post('/signUp', controllers_1.CustomerSignUp);
router.post('/login', controllers_1.CustomerLogin);
/* ------------------- Authentication Section --------------------- */
router.use(middlewares_1.Authenticate);
/* ------------------- Profile Section --------------------- */
router.patch('/verify', controllers_1.CustomerVerify);
router.get('/otp', controllers_1.OTP);
router.get('/profile', controllers_1.CustomerProfile);
router.patch('/profile', controllers_1.UpdateCutomerProfile);
/* ------------------- Cart Section --------------------- */
router.post('/cart', controllers_1.AddToCart);
router.get('/cart', controllers_1.GetCart);
router.delete('/cart', controllers_1.DeleteCart);
/* ------------------- Order Section --------------------- */
router.post('/create-order', controllers_1.CreateOrder);
router.get('/orders', controllers_1.GetOrders);
router.get('/order/:id', controllers_1.GetOrderById);
//# sourceMappingURL=CustomerRoute.js.map