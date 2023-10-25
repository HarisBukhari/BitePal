import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { CreateVendorInput } from "../dto"
import { Vendor } from "../models"
import { generateSalt, hashPassword } from "../utilities"


export const findVendor = async (id: string | undefined, email?: string) => {
    if (email) {
        return await Vendor.findOne({ email: email })
    } else {
        return await Vendor.findOne({ _id: id })
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
            return res.status(403).json({ "Failed": "Already Exists" })
        }
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    const allVendors = await Vendor.find()
    if (allVendors.length > 0) {
        return res.status(200).json(allVendors)
    } else {
        return res.status(204).json({ success: "No Vendor Found" })
    }

}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
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
}


