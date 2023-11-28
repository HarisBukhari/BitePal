"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var multer_1 = __importDefault(require("multer"));
var router = express_1.default.Router();
exports.VendorRoute = router;
//Multer
var imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        //Error 2 
        // cb(null, new Date().toISOString() + '_' + file.originalname)
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname);
    }
});
var images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
router.get('/', function (req, res, next) {
    return res.json({ "data": "Hello From Vendor!" });
});
//Login
router.post('/login', controllers_1.login);
//Authentication
router.use(middlewares_1.Authenticate);
//Vendor
router.get('/profile', controllers_1.getVendor);
router.patch('/update', controllers_1.updateVendor);
router.patch('/update/service', controllers_1.updateVendorService);
router.patch('/update/coverImage', images, controllers_1.updateVendorImage);
//Food
router.post('/food', images, controllers_1.addFood);
router.get('/food', controllers_1.getFoods);
//# sourceMappingURL=VendorRoute.js.map