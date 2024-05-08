"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
exports.VendorRoute = router;
//Multer
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'dist/images');
    },
    filename: function (req, file, cb) {
        //Error 2 
        // cb(null, new Date().toISOString() + '_' + file.originalname)
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
    }
});
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.get('/', (req, res, next) => {
    return res.json({ "data": "Hello From Vendor!" });
});
/* ------------------- Vendor Login/Auth Section --------------------- */
router.post('/login', controllers_1.login);
router.use(middlewares_1.Authenticate);
/* ------------------- Vendor Profile Section --------------------- */
router.get('/profile', controllers_1.getVendor);
router.patch('/update', controllers_1.updateVendor);
router.patch('/update/service', controllers_1.updateVendorService);
router.patch('/update/coverImage', images, controllers_1.updateVendorImage);
/* ------------------- Vendor Food Section --------------------- */
router.post('/food', images, controllers_1.addFood);
router.get('/food', controllers_1.getFoods);
/* ------------------- Vendor Order Section --------------------- */
router.get('/orders', controllers_1.GetCurrentOrders);
router.get('/order/:id', controllers_1.GetOrderDetails);
router.get('/orders/transaction', controllers_1.GetVendorTransactions);
router.put('/order/:id/process', controllers_1.ProcessOrder);
/* ------------------- Vendor Offers Section --------------------- */
router.get('/offers', controllers_1.GetOffers);
router.post('/offer', controllers_1.AddOffer);
router.put('/offer/:id', controllers_1.EditOffer);
//# sourceMappingURL=VendorRoute.js.map