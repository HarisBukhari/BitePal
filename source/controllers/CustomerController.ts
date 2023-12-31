import { Request, Response, NextFunction } from "express"
import { Customer, DeliveryUser, Food, Offer, Order, Transaction, Vendor } from "../models"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { generateOtop, generateSalt, generateSign, hashPassword, requestOtp, verifyPassword } from "../utilities"
import { CartItem, CreateCustomerInputs, CustomersLogin, EditCustomerInputs, OrderInputs } from "../dto"
import { BadRequestError, CustomError, NotFoundError } from "../error"


/* ------------------- Customer Profile Section --------------------- */

export const findCustomer = async (id: string | undefined, email?: string) => {
    try {
        if (email) {
            return await Customer.findOne({ email: email })
        }
        if (id) {
            return await Customer.findOne({ _id: id })
        }
        throw new BadRequestError('Invalid inputs', 'Customer/findCustomer')
    } catch (err) {
        if (err instanceof BadRequestError) {
            throw err
        }
        throw new CustomError('An unexpected error occurred', 'Customer/findCustomer')
    }
}

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInputs = plainToClass(CreateCustomerInputs, req.body)
        const inputErrors = await validate(customerInputs, { validationError: { target: true } })
        if (inputErrors.length > 0) {
            throw new BadRequestError('Input validation error', 'Customer/SignUp')
        }
        const { email, password, phone } = customerInputs
        const salt = await generateSalt()
        const userPassword = await hashPassword(password, salt)
        const user = await findCustomer('', email)
        if (user !== null) {
            throw new BadRequestError('A Customer exist with the provided email ID', 'Customer/SignUp')
        }
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
                verified: false,
            })
            res.status(201).json(({
                signature: signature,
                verified: customer.verified,
                email: customer.email
            }))
        } else {
            throw new CustomError('Database Error', 'Customer/Signup')
        }
    } catch (err) {
        next(err)
    }
}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInputs = plainToClass(CustomersLogin, req.body)
        const inputErrors = await validate(customerInputs, { validationError: { target: true } })
        if (inputErrors.length > 0) {
            throw new BadRequestError('Input validation error', 'Customer/CustomerLogin')
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
                        verified: false,
                    })
                    return res.status(200).send({ token: sign })
                }
                throw new BadRequestError('Input validation error', 'Customer/CustomerLogin')
            }
            throw new NotFoundError('Input validation error', 'Customer/CustomerLogin')
        }
        throw new BadRequestError('Input validation error', 'Customer/CustomerLogin')
    } catch (err) {
        next(err)
    }
}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.User
        const { otp } = req.body
        if (customer) {
            const customerProfile = await (findCustomer(customer._id, ""))
            if (customerProfile) {
                if (customerProfile.otp == otp) {
                    customerProfile.verified = true
                    await customerProfile.save()
                    res.status(200).json(customerProfile)
                }
                throw new BadRequestError('Otp Failed', 'Customer/CustomerVerify')
            }
            throw new NotFoundError('Customer not Found', 'Customer/CustomerVerify')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/CustomerVerify')
    } catch (err) {
        next(err)
    }
}

export const OTP = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.User
        if (customer) {
            const customerProfile = await (findCustomer(customer._id, ""))
            if (customerProfile) {
                const { otp, otp_expiry } = generateOtop()
                const result = await requestOtp(otp, customerProfile.phone)
                customerProfile.otp = otp
                customerProfile.otp_expiry = otp_expiry
                await customerProfile.save()
                res.status(200).json(customerProfile.otp)
            }
            throw new NotFoundError('Customer not Found', 'Customer/Otp')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/Otp')
    } catch (err) {
        next(err)
    }
}

export const CustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.User
        if (customer) {
            const customerProfile = await (findCustomer(customer._id, ""))
            if (customerProfile) {
                res.status(200).json(customerProfile)
            }
            throw new NotFoundError('Customer not Found', 'Customer/CustomerProfile')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/CustomerProfile')
    } catch (err) {
        next(err)
    }
}

export const UpdateCutomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customerInputs = plainToClass(EditCustomerInputs, req.body)
        const inputErrors = await validate(customerInputs, { validationError: { target: true } })
        if (inputErrors.length > 0) {
            throw new BadRequestError('Invalid inputs', 'Customer/UpdateCutomerProfile')
        }
        const customer = req.User
        const { firstName, lastName, address } = customerInputs
        if (customer) {
            const customerProfile = await (findCustomer(customer._id, ""))
            if (customerProfile) {
                customerProfile.firstName = firstName
                customerProfile.lastName = lastName
                customerProfile.address = address
                await customerProfile.save()
                res.status(200).json(customerProfile)
            }
            throw new NotFoundError('Customer not found', 'Customer/UpdateCutomerProfile')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/UpdateCutomerProfile')
    } catch (err) {
        next(err)
    }
}

/* ------------------- Cart Section --------------------- */


export const AddToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.User
        if (customer) {
            const profile = await Customer.findById(customer._id)
            let cartItems = Array()
            const { _id, unit } = <CartItem>req.body
            const food = await Food.findById(_id)
            if (food) {
                if (profile != null) {
                    cartItems = profile.cart
                    if (cartItems.length > 0) {
                        // check and update
                        let existFoodItems = cartItems.filter((item) => item.food._id.toString() === _id)
                        if (existFoodItems.length > 0) {
                            const index = cartItems.indexOf(existFoodItems[0])
                            if (unit > 0) {
                                cartItems[index] = { food, unit }
                            } else {
                                cartItems.splice(index, 1)
                            }
                        } else {
                            cartItems.push({ food, unit })
                        }
                    } else {
                        // add new Item
                        cartItems.push({ food, unit })
                    }
                    if (cartItems) {
                        profile.cart = cartItems as any
                        const cartResult = await profile.save()
                        return res.status(200).json(cartResult.cart)
                    }
                    throw new CustomError('Unable to add to cart!', 'Customer/AddtoCart')
                }
                throw new NotFoundError('Customer not found', 'Customer/AddtoCart')
            }
            throw new NotFoundError('Food not found', 'Customer/AddtoCart')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/AddtoCart')
    } catch (err) {
        next(err)
    }
}

export const GetCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.User
        if (customer) {
            const profile = await Customer.findById(customer._id)
            if (profile) {
                return res.status(200).json(profile.cart)
            }
            throw new NotFoundError('Customer not found', 'Customer/GetCart')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/GetCart')
    } catch (err) {
        next(err)
    }
}


export const DeleteCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.User
        if (customer) {
            const profile = await Customer.findById(customer._id).populate('cart.food')
            if (profile != null) {
                profile.cart = [] as any
                const cartResult = await profile.save()
                return res.status(200).json(cartResult)
            }
            throw new NotFoundError('Customer not found', 'Customer/DeleteCart')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/DeleteCart')
    } catch (err) {
        next(err)
    }
}


/* ------------------- Order Section --------------------- */

const validateTransaction = async (txnId: string) => {
    try {
        const currentTransaction = await Transaction.findById(txnId)
        if (currentTransaction) {
            if (currentTransaction.status.toLowerCase() !== 'failed') {
                return { status: true, currentTransaction }
            }
        }
        return { status: false, currentTransaction }
    } catch (err) {
        throw new CustomError('Database Error', 'Customer/validateTransaction')
    }
}

export const CreateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.User
        const { txnId, amount, items } = <OrderInputs>req.body
        if (customer) {
            const { status, currentTransaction } = await validateTransaction(txnId)
            if (!status) {
                throw new BadRequestError('Error while creating Order', 'Customer/createOrder')
            }
            const profile = await Customer.findById(customer._id)
            const orderId = `${Math.floor(Math.random() * 89999) + 1000}`
            const cart = <[CartItem]>items
            let cartItems = Array()
            let netAmount = 0.0
            let vendorId: string
            const foods = await Food.find().where('_id').in(cart.map(item => item._id))
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
                    orderStatus: 'Pending',
                    remarks: '',
                    deliveryId: '',
                    readyTime: 45
                })
                profile.cart = [] as any
                profile.orders.push(currentOrder)
                currentTransaction.vendorId = vendorId
                currentTransaction.orderId = orderId
                currentTransaction.status = 'CONFIRMED'
                await currentTransaction.save()
                await assignOrderForDelivery(currentOrder._id, vendorId)
                const profileResponse = await profile.save()
                return res.status(200).json(currentTransaction)
            }
            throw new CustomError('Cart items not found', 'Customer/CreateOrder')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/CreateOrder')
    } catch (err) {
        next(err)
    }
}


export const GetOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.User
        if (customer) {
            const profile = await Customer.findById(customer._id).populate("orders")
            if (profile) {
                return res.status(200).json(profile.orders)
            }
            throw new NotFoundError('Customer not found', 'Customer/GetOrders')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/GetOrders')
    } catch (err) {
        next(err)
    }
}


export const GetOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.id
        if (orderId) {
            const order = await Order.findById(orderId).populate("items.food")
            if (order) {
                return res.status(200).json(order)
            }
        }
        throw new BadRequestError('Invalid Order ID', 'Customer/GetOrderById')
    } catch (err) {
        next(err)
    }
    return res.status(400).json({ msg: 'Order not found' })
}


export const GetCustomerTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.User
        if (customer) {
            const transactions = await Transaction.find({ customer: customer._id })
            if (transactions) {
                return res.status(200).json(transactions)
            }
            throw new NotFoundError('Transaction not found', 'Customer/GetCustomerTransactions')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/GetCustomerTransactions')
    } catch (err) {
        next(err)
    }
}


/* ------------------- Verify Offer Section --------------------- */

export const VerifyOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const offerId = req.params.id
        const customer = req.User
        if (customer) {
            const appliedOffer = await Offer.findById(offerId)
            if (appliedOffer) {
                if (appliedOffer.isActive) {
                    return res.status(200).json({ message: 'Offer is Valid', offer: appliedOffer })
                }
            }
            throw new NotFoundError('Applied offer not found', 'Customer/VerifyOffer')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/VerifyOffer')
    } catch (err) {
        next(err)
    }
}


/* ------------------- Transaction Section --------------------- */

export const CreatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const customer = req.User
        if (customer) {
            const { amount, paymentMode, offerId } = req.body
            let payableAmount = Number(amount)
            if (offerId) {
                const appliedOffer = await Offer.findById(offerId).populate('vendors')
                if (appliedOffer.isActive) {
                    payableAmount = (payableAmount - appliedOffer.offerAmount)
                }
            }
            // perform payment gateway charge api

            // create record on transaction
            const transaction = await Transaction.create({
                customer: customer._id,
                vendorId: '',
                orderId: '',
                orderValue: payableAmount,
                offerUsed: offerId || 'NA',
                status: 'OPEN',
                paymentMode: paymentMode,
                paymentResponse: 'Payment is cash on Delivery'
            })
            //return transaction
            if (transaction) {
                return res.status(200).json(transaction)
            }
            throw new CustomError('Error creating transaction', 'Customer/CreatePayment')
        }
        throw new BadRequestError('Invalid Customer', 'Customer/CreatePayment')
    } catch (err) {
        next(err)
    }
}

const assignOrderForDelivery = async (orderId: string, vendorId: string) => {
    try {
        // find the vendor
        const vendor = await Vendor.findById(vendorId)
        if (vendor) {
            const areaCode = vendor.pincode
            const vendorLat = vendor.lat
            const vendorLng = vendor.lng
            //find the available Delivery person
            const deliveryPerson = await DeliveryUser.find({ pincode: areaCode, verified: true, isAvailable: true })
            if (deliveryPerson) {
                // Check the nearest delivery person and assign the order
                const currentOrder = await Order.findById(orderId)
                if (currentOrder) {
                    //update Delivery ID
                    currentOrder.deliveryId = deliveryPerson[0]._id
                    await currentOrder.save()
                    //Notify to vendor for received new order firebase push notification
                }
            }
            throw new CustomError('Delivery Person not found', 'Customer/assignOrderDelivery')
        }
        throw new CustomError('Vendor not found', 'Customer/assignOrderDelivery')
    } catch (err) {
        if (err instanceof CustomError) {
            throw err
        }
        throw new Error('An unexpected error occurred')
    }
}