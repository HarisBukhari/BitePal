import { Request, Response, NextFunction } from "express"
import { Customer, Food } from "../models"
import { generateOtop, generateSalt, generateSign, hashPassword, requestOtp, verifyPassword } from "../utilities"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { CartItem, CreateCustomerInputs, CustomersLogin, EditCustomerInputs, OrderInputs } from "../dto"
import { Order } from "../models/order"


export const findCustomer = async (id: string | undefined, email?: string) => {
    if (email) {
        return await Customer.findOne({ email: email })
    } else {
        return await Customer.findOne({ _id: id })
    }
}

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInputs, req.body)
    const inputErrors = await validate(customerInputs, { validationError: { target: true } })
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email, password, phone } = customerInputs
    const salt = await generateSalt()
    const userPassword = await hashPassword(password, salt)
    const { otp, otp_expiry } = generateOtop()
    const customer = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: otp_expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0
    })

    if (customer) {
        await requestOtp(otp, phone)
        const signature = generateSign({
            _id: customer._id,
            email: customer.email,
            verified: customer.phone,
        })

        res.status(201).json(({
            signature: signature,
            verified: customer.verified,
            email: customer.email
        }))

    } else {
        res.status(400).json({ err: "Something went wrong" })
    }
}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = plainToClass(CustomersLogin, req.body)
    const inputErrors = await validate(customerInputs, { validationError: { target: true } })
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }
    const { email, password } = customerInputs
    if (email && password) {
        const user = await findCustomer('', email)
        if (user) {
            let validPassword = await verifyPassword(password, user.password)
            if (validPassword) {
                const sign = generateSign({
                    _id: user._id,
                    email: user.email,
                    verified: user.phone,
                })
                return res.status(200).send({ token: sign })
            }
            return res.status(400).send({ message: "Please enter correct email and password" })
        }
        return res.status(204).send({ message: "Vendor not found" })
    }
    return res.status(400).send({ message: "Please enter your email and password" })
}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.User
    const { otp } = req.body
    if (customer) {
        const customerProfile = await (findCustomer(customer._id, ""))
        if (customerProfile) {
            if (customerProfile.otp == otp) {
                customerProfile.verified = true
                await customerProfile.save()
                res.status(200).json(customerProfile)
            } else {
                res.status(404).json({ message: "Otp Failed!" })
            }
        } else {
            res.status(404).json({ message: "Something went wrong!" })
        }
    } else {
        res.status(404).json({ message: "Something went wrong" })
    }
}

export const OTP = async (req: Request, res: Response, next: NextFunction) => {


}

export const CustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.User
    if (customer) {
        const customerProfile = await (findCustomer(customer._id, ""))
        if (customerProfile) {
            res.status(200).json(customerProfile)
        } else {
            res.status(404).json({ message: "Something went wrong!" })
        }
    } else {
        res.status(404).json({ message: "Something went wrong" })
    }
}

export const UpdateCutomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = plainToClass(EditCustomerInputs, req.body)
    const inputErrors = await validate(customerInputs, { validationError: { target: true } })
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }
    const customer = req.User
    const { firstName, lastName, address } = customerInputs
    if (customer) {
        const customerProfile = await (findCustomer(customer._id, ""))
        if (customerProfile) {
            customerProfile.firstName = firstName
            customerProfile.lastName = lastName
            customerProfile.address = address
            try {
                await customerProfile.save()
                res.status(200).json(customerProfile)
            } catch (error) {
                console.error('Database error:', error)
                res.status(500).json({ message: 'Internal server error' })
            }
        } else {
            res.status(404).json({ message: "Something went wrong!" })
        }
    } else {
        res.status(404).json({ message: "Something went wrong" })
    }
}

/* ------------------- Order Section --------------------- */

// const validateTransaction = async(txnId: string) => {

//     const currentTransaction = await Transaction.findById(txnId)

//     if(currentTransaction){
//         if(currentTransaction.status.toLowerCase() !== 'failed'){
//             return {status: true, currentTransaction}
//         }
//     }
//     return {status: false, currentTransaction}
// }



export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {


    const customer = req.User

    const { txnId, amount, items } = <OrderInputs>req.body


    if (customer) {

        // const { status, currentTransaction } =  await validateTransaction(txnId)

        // if(!status){
        //     return res.status(404).json({ message: 'Error while Creating Order!'})
        // }

        const profile = await Customer.findById(customer._id)


        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`

        const cart = <[CartItem]>req.body

        let cartItems = Array()

        let netAmount = 0.0

        let vendorId

        const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec()

        foods.map(food => {
            cart.map(({ _id, unit }) => {
                if (food._id == _id) {
                    vendorId = food.vendorId
                    netAmount += (food.price * unit)
                    cartItems.push({ food, unit })
                }
            })
        })

        if (cartItems) {

            const currentOrder = await Order.create({
                orderId: orderId,
                vendorId: vendorId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount: amount,
                orderDate: new Date(),
                orderStatus: 'Waiting',
                remarks: '',
                deliveryId: '',
                readyTime: 45
            })

            profile.cart = [] as any
            profile.orders.push(currentOrder)


            // currentTransaction.vendorId = vendorId
            // currentTransaction.orderId = orderId
            // currentTransaction.status = 'CONFIRMED'

            // await currentTransaction.save()

            // await assignOrderForDelivery(currentOrder._id, vendorId)

            const profileResponse = await profile.save()

            return res.status(200).json(profileResponse)

        }

    }

    return res.status(400).json({ msg: 'Error while Creating Order' })
}

export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {

    const customer = req.User

    if (customer) {


        const profile = await Customer.findById(customer._id).populate("orders")
        if (profile) {
            return res.status(200).json(profile.orders)
        }

    }

    return res.status(400).json({ msg: 'Orders not found' })
}


export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {

    const orderId = req.params.id


    if (orderId) {


        const order = await Customer.findById(orderId).populate("items.food")

        if (order) {
            return res.status(200).json(order)
        }

    }

    return res.status(400).json({ msg: 'Order not found' })
}