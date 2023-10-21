import { Request, Response, NextFunction } from "express"
import { CreateVendorInput } from "../dto"
import { Vendor } from "../models"

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { address, email, foodType, name, ownerName, password, phone, pincode } = <CreateVendorInput>req.body
    const findOne = await Vendor.findOne({ email: email })
    if (!findOne) {
        const CreateVendor = await Vendor.create({
            name: name,
            email: email,
            address: address,
            foodType: foodType,
            ownerName: ownerName,
            password: password,
            phone: phone,
            pincode: pincode,
            salt: '000000',
            rating: 0,
            serviceAvailable: false,
            coverImage: [],
        })
        return res.json({ "success": CreateVendor })
    } else {
        return res.json({ "Failed": "Already Exists" })
    }
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    return res.json({ "success": "All Vendors Found" })
}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    return res.json({ "success": "VendorById Found" })
}


