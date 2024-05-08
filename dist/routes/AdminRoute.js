"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
exports.AdminRoute = router;
/* ------------------- Admin Vendor Section --------------------- */
router.get('/vendors', controllers_1.GetVendors);
router.get('/vendor/:id', controllers_1.GetVendorById);
router.post('/vendor', controllers_1.CreateVendor);
/* ------------------- Transactions Section --------------------- */
router.get('/transactions', controllers_1.GetTransactions);
router.get('/transaction/:id', controllers_1.GetTransactionById);
/* ------------------- Delivery User Section --------------------- */
router.put('/delivery/verify', controllers_1.VerifyDeliveryUser);
router.get('/delivery/users', controllers_1.GetDeliveryUsers);
//# sourceMappingURL=AdminRoute.js.map