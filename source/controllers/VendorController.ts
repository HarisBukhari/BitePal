import { Request, Response, NextFunction } from "express"
import { UpdateVendor, VendorLogin, CreateFoodInput, CreateOfferInputs } from "../dto"
import { findVendor } from "."
import { generateSign, verifyPassword } from "../utilities"
import { Food, Offer, Order, Transaction } from "../models"
import { BadRequestError, CustomError, NotFoundError } from "../error"
import { get, set } from "../services/Redis"


/* ------------------- Vendor Profile Section --------------------- */

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = <VendorLogin>req.body
        if (email && password) {
            const user = await findVendor('', email)
            if (user) {
                let validPassword = await verifyPassword(password, user.password)
                if (validPassword) {
                    const sign = generateSign({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        foodType: user.foodType
                    })
                    return res.status(200).send({ token: sign })
                }
                throw new CustomError('Invalid Inputs', 'Vendor/VendorLogin')
            }
            throw new NotFoundError('Vendor Not Found', 'Vendor/VendorLogin')
        }
        throw new BadRequestError('Please enter your email and password', 'Vendor/VendorLogin')
    } catch (err) {
        next(err)
    }
}

export const getVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = req.User
        if (vendor) {
            const vendorProfile = await (findVendor(vendor._id, ""))
            if (vendorProfile) {
                return res.status(200).json(vendorProfile)
            }
            throw new CustomError('Something Went Wrong', 'Vendor/getVendor')
        }
        throw new NotFoundError('Vendor Not Found', 'Vendor/getVendor')
    } catch (err) {
        next(err)
    }
}


export const updateVendor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = req.User
        const { address, foodType, name, phone } = <UpdateVendor>req.body
        if (vendor) {
            const vendorProfile = await (findVendor(vendor._id, ""))
            if (vendorProfile) {
                vendorProfile.foodType = foodType
                vendorProfile.name = name
                vendorProfile.address = address
                vendorProfile.phone = phone
                await vendorProfile.save()
                res.status(200).json(vendorProfile)
            }
            throw new CustomError('Something Went Wrong', 'Vendor/updateVendor')
        }
        throw new NotFoundError('Vendor Not Found', 'Vendor/updateVendor')
    } catch (err) {
        next(err)
    }
}

export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = req.User
        const { lat, lng } = req.body
        if (vendor) {
            const vendorProfile = await (findVendor(vendor._id, ""))
            if (vendorProfile) {
                vendorProfile.serviceAvailable = !vendorProfile.serviceAvailable
                vendorProfile.lat = lat
                vendorProfile.lng = lng
                await vendorProfile.save()
                res.status(200).json(vendorProfile)
            }
            throw new CustomError('Something Went Wrong', 'Vendor/updateVendorService')
        }
        throw new NotFoundError('Vendor Not Found', 'Vendor/updateVendorService')
    } catch (err) {
        next(err)
    }
}

export const updateVendorImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = req.User
        if (vendor) {
            const vendorProfile = await (findVendor(vendor._id, ""))
            if (vendorProfile) {
                const files = req.files as [Express.Multer.File]
                const images = files.map((file: Express.Multer.File) => file.filename)
                vendorProfile.coverImage.push(...images)
                await vendorProfile.save()
                return res.status(201).json({ "success": vendorProfile })
            }
            throw new CustomError('Something Went Wrong', 'Vendor/updateVendorImage')
        }
        throw new NotFoundError('Vendor Not Found', 'Vendor/updateVendorImage')
    } catch (err) {
        next(err)
    }
}

/* ------------------- Vendor Food Section --------------------- */

export const addFood = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = req.User
        if (vendor) {
            const vendorProfile = await (findVendor(vendor._id, ""))
            if (vendorProfile) {
                //Here
                const { name, category, description, foodType, price, readyTime } = <CreateFoodInput>req.body
                const files = req.files as [Express.Multer.File]
                const images = files.map((file: Express.Multer.File) => file.filename)
                const food = await Food.create({
                    vendorId: vendorProfile._id,
                    name: name,
                    category: category,
                    description: description,
                    foodType: foodType,
                    price: price,
                    readyTime: readyTime,
                    rating: 0,
                    image: images
                })
                vendorProfile.foods.push(food)
                await vendorProfile.save()
                return res.status(201).json({ "success": vendorProfile })
            }
            throw new CustomError('Something Went Wrong', 'Vendor/addFood')
        }
        throw new NotFoundError('Vendor Not Found', 'Vendor/addFood')
    } catch (err) {
        next(err)
    }
}

export const getFoods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = req.User
        if (vendor) {
            const vendorProfile = await (findVendor(vendor._id, ""))
            if (vendorProfile) {
                const foods = await Food.find({ vendorId: vendorProfile.id })
                if (foods.length > 0) {
                    const cacheValue = await get('foods')
                    if (cacheValue) {
                        return res.status(200).json(JSON.parse(cacheValue))
                    }
                    await set('foods', JSON.stringify(foods), 30)
                    return res.status(200).json(foods)
                } else {
                    return res.status(404).json({ message: '404 what else you can expect' })
                }
            }
            throw new CustomError('Something Went Wrong', 'Vendor/getFoods')
        }
        throw new NotFoundError('Vendor Not Found', 'Vendor/getFoods')
    } catch (err) {
        next(err)
    }
}


/* ------------------- Vendor Order Section --------------------- */

export const GetCurrentOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.User
        if (user) {
            const orders = await Order.find({ vendorId: user._id }).populate('items.food')
            if (orders != null) {
                return res.status(200).json(orders)
            }
            throw new CustomError('Something Went Wrong', 'Vendor/GetCurrentOrders')
        }
        throw new NotFoundError('Orders Not Found', 'Vendor/GetCurrentOrders')
    } catch (err) {
        next(err)
    }
}

export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.id
        if (orderId) {
            const order = await Order.findById(orderId).populate('items.food')
            if (order != null) {
                return res.status(200).json(order)
            }
            throw new CustomError('Something Went Wrong', 'Vendor/GetOrderDetails')
        }
        throw new NotFoundError('Orders Not Found', 'Vendor/GetOrderDetails')
    } catch (err) {
        next(err)
    }
}

export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = req.params.id
        const { status, remarks, time } = req.body
        const validOrder = await Order.findById(orderId).populate('food')
        if (validOrder) {
            validOrder.orderStatus = status
            validOrder.remarks = remarks
            if (time) {
                validOrder.readyTime = time
            }
            const orderResult = await validOrder.save()
            if (orderResult != null) {
                return res.status(200).json(orderResult)
            }
            throw new CustomError('Something Went Wrong', 'Vendor/ProcessOrder')
        }
        throw new NotFoundError('Orders Not Found', 'Vendor/ProcessOrder')
    } catch (err) {
        next(err)
    }
}

/* ------------------- Vendor Transaction Section --------------------- */

export const GetVendorTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = req.User
        if (vendor) {
            const transactions = await Transaction.find({ vendorId: vendor._id })
            if (transactions) {
                return res.status(200).json(transactions)
            }
            throw new CustomError('Something Went Wrong', 'Vendor/GetVendorTransactions')
        }
        throw new NotFoundError('Vendor Not Found', 'Vendor/GetVendorTransactions')
    } catch (err) {
        next(err)
    }
}

/* ------------------- Vendor Offer Section --------------------- */

export const GetOffers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.User
        if (user) {
            let currentOffer = Array()
            const offers = await Offer.find().populate('vendors')
            if (offers) {
                offers.map(item => {
                    if (item.vendors) {
                        item.vendors.map(vendor => {
                            if (vendor._id.toString() === user._id) {
                                currentOffer.push(item)
                            }
                        })
                    }
                    if (item.offerType === "GENERIC") {
                        currentOffer.push(item)
                    }
                })
            }
            throw new CustomError('Something Went Wrong', 'Vendor/GetOffers')
        }
        throw new NotFoundError('Vendor Not Found', 'Vendor/GetOffers')
    } catch (err) {
        next(err)
    }
}


export const AddOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendor = req.User
        if (vendor) {
            const { title, description, offerType, offerAmount, pincode,
                promocode, promoType, startValidity, endValidity, bank,
                bins, minValue, isActive } = <CreateOfferInputs>req.body
            const validVendor = await findVendor(vendor._id)
            if (validVendor) {
                const offer = await Offer.create({
                    title,
                    description,
                    offerType,
                    offerAmount,
                    pincode,
                    promoType,
                    startValidity,
                    endValidity,
                    bank,
                    isActive,
                    minValue,
                    vendors: [vendor]
                })
                if (offer) {
                    return res.status(200).json(offer)
                }
                throw new CustomError('Something Went Wrong', 'Vendor/AddOffer')
            }
            throw new NotFoundError('Vendor Not Found', 'Vendor/AddOffer')
        }
        throw new BadRequestError('Invalid Inputs', 'Vendor/AddOffer')
    } catch (err) {
        next(err)
    }
}

export const EditOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.User
        const offerId = req.params.id
        if (user) {
            const { title, description, offerType, offerAmount, pincode,
                promocode, promoType, startValidity, endValidity, bank,
                bins, minValue, isActive } = <CreateOfferInputs>req.body
            const currentOffer = await Offer.findById(offerId)
            if (currentOffer) {
                const vendor = await findVendor(user._id)
                if (vendor) {
                    currentOffer.title = title,
                        currentOffer.description = description,
                        currentOffer.offerType = offerType,
                        currentOffer.offerAmount = offerAmount,
                        currentOffer.pincode = pincode,
                        currentOffer.promoType = promoType,
                        currentOffer.startValidity = startValidity,
                        currentOffer.endValidity = endValidity,
                        currentOffer.bank = bank,
                        currentOffer.isActive = isActive,
                        currentOffer.minValue = minValue
                    const result = await currentOffer.save()
                    if (result) {
                        return res.status(200).json(result)
                    }
                    throw new CustomError('Something Went Wrong', 'Vendor/EditOffer')
                }
                throw new NotFoundError('Vendor Not Found', 'Vendor/EditOffer')
            }
            throw new NotFoundError('Vendor Not Found', 'Vendor/EditOffer')
        }
        throw new BadRequestError('Invalid Inputs', 'Vendor/EditOffer')
    } catch (err) {
        next(err)
    }
}
