import express, { Request, Response, NextFunction } from "express"
import { CreateOrder, CustomerLogin, CustomerProfile, CustomerSignUp, CustomerVerify, GetOrderById, GetOrders, OTP, UpdateCutomerProfile,  } from "../controllers"
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

router.post('/create-order', CreateOrder)
router.get('/orders', GetOrders)
router.get('/order/:id', GetOrderById)

export { router as CustomerRoute }