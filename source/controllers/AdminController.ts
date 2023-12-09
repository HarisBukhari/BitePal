import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { CreateVendorInput } from "../dto"
import { DeliveryUser, Transaction, Vendor } from "../models"
import { generateSalt, hashPassword } from "../utilities"
import { BadRequestError, NotFoundError, UnauthenticatedError } from "../error"

/* ------------------- Vendor Section --------------------- */

export const findVendor = async (id: string | undefined, email?: string) => {
    try {
        if (email) {
            return await Vendor.findOne({ email: email })
        } else {
            return await Vendor.findOne({ _id: id })
        }
    } catch (err) {
        throw new NotFoundError('Error finding vendor in the database', 'Admin/findVendor')
    }
}

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { address, email, foodType, name, ownerName, password, phone, pincode } = <CreateVendorInput>req.body
    try {
        const findOne = await findVendor('', email)
        if (!findOne) {
            const bcryptSalt = await generateSalt()
            const bcryptPassword = await hashPassword(password, bcryptSalt)
            const CreateVendor = await Vendor.create({
                name: name,
                email: email,
                address: address,
                foodType: foodType,
                ownerName: ownerName,
                password: bcryptPassword,
                phone: phone,
                pincode: pincode,
                salt: bcryptSalt,
                rating: 0,
                serviceAvailable: false,
                coverImage: [],
            })
            return res.status(201).json({ "success": CreateVendor })
        } else {
            throw new BadRequestError('Vendor Already Exists', 'Admin/CreateVendor')
        }
    } catch (err) {
        next(err)
    }
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allVendors = await Vendor.find()
        if (allVendors.length > 0) {
            return res.status(200).json(allVendors)
        } else {
            throw new NotFoundError('Error finding vendor in the database', 'Admin/findVendor')
        }
    } catch (err) {
        next(err)
    }
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendorId = req.params.id
        if (mongoose.Types.ObjectId.isValid(vendorId)) {
            // It's a valid ObjectID, proceed with the query.
            const vendor = await findVendor(vendorId, '')
            if (vendor) {
                return res.status(200).json(vendor)
            }
            throw new NotFoundError('Vendor not found', 'Admin/GetVendorById')
        }
        throw new BadRequestError('Invalid vendor ID', 'Admin/GetVendorById')
    } catch (err) {
        next(err)
    }
}

/* ------------------- Transaction Section --------------------- */

export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transactions = await Transaction.find()
        if (transactions) {
            return res.status(200).json(transactions)
        }
        throw new NotFoundError('Transaction not found', 'Admin/GetTransactions')
    } catch (err) {
        next(err)
    }
}


export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const transaction = await Transaction.findById(id)
        if (transaction) {
            return res.status(200).json(transaction)
        }
        throw new NotFoundError('Transaction not found', 'Admin/GetTransactionById')
    } catch (err) {
        next(err)
    }
}

/* ------------------- Delivery Section --------------------- */

export const VerifyDeliveryUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { _id, status } = req.body
        if (_id) {
            const profile = await DeliveryUser.findById(_id)
            if (profile) {
                profile.verified = status
                const result = await profile.save()
                return res.status(200).json(result)
            }
        }
        throw new BadRequestError('Unable to verify Delivery User', 'Admin/VerifyDeliveryUser')
    } catch (err) {
        next(err)
    }
}


export const GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryUsers = await DeliveryUser.find()
        if (deliveryUsers) {
            return res.status(200).json(deliveryUsers)
        }
        throw new BadRequestError('Unable to get Delivery Users','Admin/GetDeliveryUsers')
    } catch (err) {
        next(err)
    }
}