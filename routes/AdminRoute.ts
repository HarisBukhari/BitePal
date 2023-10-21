import express, { Request, Response, NextFunction } from "express"
import { CreateVendor, GetVendorById, GetVendors } from "../controllers"
const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json({ "data": "Hello From Admin!" })
})

router.get('/vendors', GetVendors)

router.get('/vendor/:id', GetVendorById)


router.post('/vendor', CreateVendor)


export { router as AdminRoute }