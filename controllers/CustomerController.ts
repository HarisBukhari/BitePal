import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { CreateVendorInput } from "../dto"
import { Vendor } from "../models"
import { generateSalt, hashPassword } from "../utilities"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { CreateCustomerInputs } from "../dto/Customer.dto"


export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInputs, req.body)
    const inputErrors = await validate(customerInputs, { validationError: { target: true } })
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email, password, phone } = customerInputs
    

}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {

}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {

}

export const OTP = async (req: Request, res: Response, next: NextFunction) => {

}

export const CustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

}

export const UpdateCutomerProfile = async (req: Request, res: Response, next: NextFunction) => {

}

