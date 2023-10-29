import express, { Request, Response, NextFunction } from "express"
import { login, getVendor, updateVendor, updateVendorImage, updateVendorService, addFood, getFoods } from "../controllers"
import { hello } from "../controllers"
import { Authenticate } from "../middlewares"

const router = express.Router()


router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json({ "data": "Hello From Vendor!" })
})

//Login
// router.post('/login', login)

//Authentication
// router.use(Authenticate)

//Vendor
router.get('/:pincode', hello)
router.get('/top-restaurants/:pincode', hello)
router.get('/foods-in-30-min/:pincode', hello)
router.get('/search/:pincode', hello)
router.get('/restaurant/:id', hello)

export { router as ShoppingRoute }