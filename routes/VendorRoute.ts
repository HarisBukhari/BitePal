import express, { Request, Response, NextFunction } from "express"
import { login } from "../controllers"
const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json({ "data": "Hello From Vendor!" })
})

router.post('/login', login)
router.get('/vendor', login)
router.patch('/vendor', login)
router.patch('/vendorService', login)

export { router as VendorRoute }