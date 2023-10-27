import express, { Request, Response, NextFunction } from "express"
import { login, getVendor, updateVendor, updateVendorImage, updateVendorService, addFood, getFoods } from "../controllers"
import { Authenticate } from "../middlewares"
import multer from "multer"

const router = express.Router()

//Multer
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
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

//Login
router.post('/login', login)

//Authentication
router.use(Authenticate)

//Vendor
router.get('/profile', getVendor)
router.patch('/update', updateVendor)
router.patch('/update/service', updateVendorService)
router.patch('/update/coverImage', images, updateVendorImage)

//Food
router.post('/food', images, addFood)
router.get('/food', getFoods)

export { router as VendorRoute }