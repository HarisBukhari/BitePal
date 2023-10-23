import { Request, Response, NextFunction } from "express"
import { VendorLogin } from "../dto"
import mongoose from "mongoose"
import { Vendor } from "../models"
import { findVendor } from "../controllers"
import { generateSalt, hashPassword, verifyPassword } from "../utilities"

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VendorLogin>req.body
    let validPassword = false
    if (!email || !password) {
        res.status(201).send({ message: "Please enter your email and password" })
    }
    const user = await findVendor('', email)
    if(!user) {
        res.status(201).send({ message: "Vendor not found" })
    }else{
        validPassword = await verifyPassword(user.password, password)
    }

    res.status(200).send({ validPassword: validPassword })
}