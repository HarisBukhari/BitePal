import express, { Request, Response, NextFunction } from "express"
import { AddToCart, CreateOrder, CustomerLogin, CustomerProfile, CustomerSignUp, CustomerVerify, DeleteCart, GetCart, GetOrderById, GetOrders, OTP, UpdateCutomerProfile,  } from "../controllers"
import { Authenticate } from "../middlewares"
const router = express.Router()

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json({ "data": "Hello From Admin!" })
})

/* ------------------- Login/SignUp Section --------------------- */

router.post('/signUp', CustomerSignUp)
router.post('/login', CustomerLogin)

/* ------------------- Authentication Section --------------------- */
router.use(Authenticate)

/* ------------------- Profile Section --------------------- */
router.patch('/verify', CustomerVerify)
router.get('/otp', OTP)
router.get('/profile', CustomerProfile)
router.patch('/profile', UpdateCutomerProfile)


/* ------------------- Cart Section --------------------- */

router.post('/cart', AddToCart)
router.get('/cart', GetCart)
router.delete('/cart', DeleteCart)


/* ------------------- Order Section --------------------- */

router.post('/create-order', CreateOrder)
router.get('/orders', GetOrders)
router.get('/order/:id', GetOrderById)

export { router as CustomerRoute }