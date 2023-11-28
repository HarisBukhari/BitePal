import express, { Request, Response, NextFunction } from "express"
import { CustomerLogin, CustomerProfile, CustomerSignUp, CustomerVerify, OTP, UpdateCutomerProfile,  } from "../controllers"
import { Authenticate } from "../middlewares"
const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json({ "data": "Hello From Admin!" })
})

router.post('/signUp', CustomerSignUp)
router.post('/login', CustomerLogin)

//Authentication
router.use(Authenticate)
router.patch('/verify', CustomerVerify)
router.get('/otp', OTP)
router.get('/profile', CustomerProfile)

router.patch('/profile', UpdateCutomerProfile)



export { router as CustomerRoute }