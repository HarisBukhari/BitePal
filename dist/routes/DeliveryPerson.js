"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
exports.DeliveryRoute = router;
/* ------------------- Signup / Create Delivery Person --------------------- */
router.post('/signup', controllers_1.DeliverySignUp);
/* ------------------- Login --------------------- */
router.post('/login', controllers_1.DeliveryLogin);
/* ------------------- Authentication --------------------- */
router.use(middlewares_1.Authenticate);
/* ------------------- Change Service Status --------------------- */
router.put('/change-status', controllers_1.UpdateDeliveryUserStatus);
/* ------------------- Profile --------------------- */
router.get('/profile', controllers_1.GetDeliveryProfile);
router.patch('/profile', controllers_1.EditDeliveryProfile);
//# sourceMappingURL=DeliveryPerson.js.map