import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { CreateVendorInput } from "../dto"
import { DeliveryUser, Transaction, Vendor } from "../models"
import { generateSalt, hashPassword } from "../utilities"


export const findVendor = async (id: string | undefined, email?: string) => {
    try {
        if (email) {
            return await Vendor.findOne({ email: email })
        } else {
            return await Vendor.findOne({ _id: id })
        }
    } catch (err) {
        console.error('Find Vendor Database error:', err)
    }
}

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { address, email, foodType, name, ownerName, password, phone, pincode } = <CreateVendorInput>req.body
    try {
        const findOne = await findVendor('', email)
        if (!findOne) {
            const bcryptSalt = await generateSalt()
            const bcryptPassword = await hashPassword(password, bcryptSalt)
            try {
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
            } catch (err) {
                console.error('Database error:', err)
                res.status(500).json({ message: 'Internal server error' })
            }
        } else {
            return res.status(403).json({ "Failed": "Already Exists" })
        }
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allVendors = await Vendor.find()
        if (allVendors.length > 0) {
            return res.status(200).json(allVendors)
        } else {
            return res.status(204).json({ success: "No Vendor Found" })
        }
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).json({ message: 'Internal server error' })
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
            return res.status(204).json({ Failed: 'Vendor not Found' })
        } else {
            // It's not a valid ObjectID, return an error response.
            return res.status(403).json({ Error: 'Invalid vendor ID' })
        }
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}


export const GetTransactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const transactions = await Transaction.find()
        if (transactions) {
            return res.status(200).json(transactions)
        }
        return res.json({ "message": "Transactions data not available" })
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}


export const GetTransactionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const transaction = await Transaction.findById(id)
        if (transaction) {
            return res.status(200).json(transaction)
        }
        return res.json({ "message": "Transaction data not available" })
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}

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
        return res.json({ message: 'Unable to verify Delivery User' })
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}


export const GetDeliveryUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryUsers = await DeliveryUser.find()
        if (deliveryUsers) {
            return res.status(200).json(deliveryUsers)
        }
        return res.json({ message: 'Unable to get Delivery Users' })
    } catch (err) {
        console.error('Database error:', err)
        res.status(500).json({ message: 'Internal server error' })
    }
}