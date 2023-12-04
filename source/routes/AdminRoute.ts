import express from "express"
import { CreateVendor, GetDeliveryUsers, GetTransactionById, GetTransactions, GetVendorById, GetVendors, VerifyDeliveryUser } from "../controllers"
const router = express.Router()

/* ------------------- Admin Vendor Section --------------------- */
router.get('/vendors', GetVendors)
router.get('/vendor/:id', GetVendorById)
router.post('/vendor', CreateVendor)

/* ------------------- Transactions Section --------------------- */
router.get('/transactions', GetTransactions)
router.get('/transaction/:id', GetTransactionById)

/* ------------------- Delivery User Section --------------------- */
router.put('/delivery/verify', VerifyDeliveryUser)
router.get('/delivery/users', GetDeliveryUsers);

export { router as AdminRoute }