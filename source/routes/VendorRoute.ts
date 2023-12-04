import express, { Request, Response, NextFunction } from "express"
import { login, getVendor, updateVendor, updateVendorImage, updateVendorService, addFood, getFoods, GetCurrentOrders, ProcessOrder, GetOrderDetails, GetOffers, EditOffer, AddOffer } from "../controllers"
import { Authenticate } from "../middlewares"
import multer from "multer"

const router = express.Router()

//Multer
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'dist/images')
    },
    filename: function (req, file, cb) {
        //Error 2 
        // cb(null, new Date().toISOString() + '_' + file.originalname)
        cb(null, new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname)
    }
})

const images = multer({ storage: imageStorage }).array('images', 10)


router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json({ "data": "Hello From Vendor!" })
})

/* ------------------- Vendor Login/Auth Section --------------------- */

router.post('/login', login)
router.use(Authenticate)

/* ------------------- Vendor Profile Section --------------------- */

router.get('/profile', getVendor)
router.patch('/update', updateVendor)
router.patch('/update/service', updateVendorService)
router.patch('/update/coverImage', images, updateVendorImage)


/* ------------------- Vendor Food Section --------------------- */

router.post('/food', images, addFood)
router.get('/food', getFoods)

/* ------------------- Vendor Order Section --------------------- */

router.get('/orders',GetCurrentOrders)
router.get('/order/:id',GetOrderDetails)
router.put('/order/:id/process',ProcessOrder)

/* ------------------- Vendor Offers Section --------------------- */

router.get('/offers', GetOffers);
router.post('/offer', AddOffer);
router.put('/offer/:id', EditOffer)

export { router as VendorRoute }
