"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var router = express_1.default.Router();
exports.CustomerRoute = router;
router.get('/', function (req, res, next) {
    return res.json({ "data": "Hello From Admin!" });
});
router.post('/signUp', controllers_1.CustomerSignUp);
router.post('/login', controllers_1.CustomerLogin);
//Authentication
router.use(middlewares_1.Authenticate);
router.patch('/verify', controllers_1.CustomerVerify);
router.get('/otp', controllers_1.OTP);
router.get('/profile', controllers_1.CustomerProfile);
router.patch('/profile', controllers_1.UpdateCutomerProfile);
//# sourceMappingURL=CustomerRoute.js.map