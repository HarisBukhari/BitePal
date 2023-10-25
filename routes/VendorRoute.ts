import express, { Request, Response, NextFunction } from "express"
import { login, getVendor, updateVendor, updateService, updateVendorService } from "../controllers"
import { Authenticate } from "../middlewares"
const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json({ "data": "Hello From Vendor!" })
})

router.post('/login', login)

//Authentication
router.use(Authenticate)

router.get('/profile', getVendor)
router.patch('/update', updateVendor)
router.patch('/update/service', updateService)
router.patch('/vendorService', login)

export { router as VendorRoute }