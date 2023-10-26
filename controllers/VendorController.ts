import { Request, Response, NextFunction } from "express"
import { UpdateVendor, VendorLogin, CreateFoodInput } from "../dto"
import { findVendor } from "../controllers"
import { generateSign, verifyPassword } from "../utilities"
import { Food } from "../models/food"

export const login = async (req: Request, res: Response, next: NextFunction) => {
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
            return res.status(400).send({ message: "Please enter correct email and password" })
        }
        return res.status(204).send({ message: "Vendor not found" })
    }
    return res.status(400).send({ message: "Please enter your email and password" })
}

export const getVendor = async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.User
    if (vendor) {
        const vendorProfile = await (findVendor(vendor._id, ""))
        if (vendorProfile) {
            res.status(200).json(vendorProfile)
        } else {
            res.status(404).json({ message: "Something went wrong" })
        }
    } else {
        res.status(404).json({ message: "Something went wrong" })
    }
}
export const updateVendor = async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.User
    const { address, foodType, name, phone } = <UpdateVendor>req.body
    if (vendor) {
        const vendorProfile = await (findVendor(vendor._id, ""))
        if (vendorProfile) {
            vendorProfile.foodType = foodType
            vendorProfile.name = name
            vendorProfile.address = address
            vendorProfile.phone = phone
            try {
                await vendorProfile.save()
                res.status(200).json(vendorProfile)
            } catch (error) {
                console.error('Database error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            res.status(404).json({ message: "Something went wrong" })
        }
    } else {
        res.status(404).json({ message: "Something went wrong" })
    }
}

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.User
    if (vendor) {
        const vendorProfile = await (findVendor(vendor._id, ""))
        if (vendorProfile) {
            vendorProfile.serviceAvailable = !vendorProfile.serviceAvailable
            try {
                await vendorProfile.save()
                res.status(200).json(vendorProfile)
            } catch (error) {
                console.error('Database error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            res.status(404).json({ message: "Something went wrong" })
        }
    } else {
        res.status(404).json({ message: "Something went wrong" })
    }
}

export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {

}

export const addFood = async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.User
    if (vendor) {
        const vendorProfile = await (findVendor(vendor._id, ""))
        if (vendorProfile) {
            //Here
            const { name, category, description, foodType, price, readyTime } = <CreateFoodInput>req.body
            try {
                const files = req.files as [Express.Multer.File]
                const images = files.map((file: Express.Multer.File)=> file.filename)
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
            } catch (error) {
                console.error('Database error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            res.status(404).json({ message: "Something went wrong" })
        }
    } else {
        res.status(404).json({ message: "Something went wrong" })
    }
}

export const getFoods = async (req: Request, res: Response, next: NextFunction) => {
    const vendor = req.User
    if (vendor) {
        const vendorProfile = await (findVendor(vendor._id, ""))
        if (vendorProfile) {
            try {
                const foods = await Food.find({ vendorId: vendorProfile.id })
                if (foods.length > 0) {
                    res.status(200).json(foods)
                } else {
                    res.status(404).json({ message: '404 what else you can expect' });
                }
            } catch (err) {
                console.error('Database error:', err);
                res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            res.status(404).json({ message: "Something went wrong" })
        }
    }

}