import { Request, Response, NextFunction } from "express"
import { VendorLogin, VendorPayload } from "../dto"
import { findVendor } from "../controllers"
import { generateSign, verifyPassword } from "../utilities"

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VendorLogin>req.body
    if (email && password) {
        const user = await findVendor('', email)
        if (user) {
            let validPassword = await verifyPassword(password, user.password)
            if(validPassword){
                const sign = generateSign({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    foodType: user.foodType
                })
                return res.status(200).send({token: sign})
            }
            return res.status(400).send({ message: "Please enter correct email and password" })
        }
        return res.status(400).send({ message: "Vendor not found" })
    }
    return res.status(400).send({ message: "Please enter your email and password" })
}

export const getVendor = async (req: Request, res: Response, next: NextFunction) => {

}
export const updateVendor = async (req: Request, res: Response, next: NextFunction) => {

}
export const updateVendorService = async (req: Request, res: Response, next: NextFunction) => {

}