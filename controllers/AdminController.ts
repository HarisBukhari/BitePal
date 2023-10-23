import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { CreateVendorInput } from "../dto"
import { Vendor } from "../models"
import { generateSalt, hashPassword } from "../utilities"


export const findVendor = async (id: string | undefined, email?: string) => {
    if(email) {
        return await Vendor.findOne({ email: email})
    }else{
        return await Vendor.findOne({ _id: id})
    }
}

export const CreateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { address, email, foodType, name, ownerName, password, phone, pincode } = <CreateVendorInput>req.body
    const findOne = await findVendor('',email)
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
        return res.json({ "success": CreateVendor })
    } else {
        return res.json({ "Failed": "Already Exists" })
    }
}

export const GetVendors = async (req: Request, res: Response, next: NextFunction) => {
    const allVendors = await Vendor.find()
    if (allVendors.length > 0) {
        return res.json(allVendors);
    } else {
        return res.json({ success: "No Vendor Found" });
    }

}

export const GetVendorById = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id
    if (mongoose.Types.ObjectId.isValid(vendorId)) {
        // It's a valid ObjectID, proceed with the query.
        const vendor = await findVendor(vendorId,'');
        if (vendor) {
            return res.json(vendor);
        }
        return res.json({ Failed: 'Vendor not Found' });
    } else {
        // It's not a valid ObjectID, return an error response.
        return res.status(400).json({ Error: 'Invalid vendor ID' });
    }
}


