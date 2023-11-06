import { Request, Response, NextFunction } from "express"
import { Customer } from "../models"
import { generateOtop, generateSalt, generateSign, hashPassword, requestOtp, verifyPassword } from "../utilities"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import { CreateCustomerInputs, CustomersLogin } from "../dto"


export const findCustomer = async (id: string | undefined, email?: string) => {
    if (email) {
        return await Customer.findOne({ email: email })
    } else {
        return await Customer.findOne({ _id: id })
    }
}


export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {

    const customerInputs = plainToClass(CreateCustomerInputs, req.body)
    const inputErrors = await validate(customerInputs, { validationError: { target: true } })
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors)
    }

    const { email, password, phone } = customerInputs
    const salt = await generateSalt()
    const userPassword = await hashPassword(password, salt)
    const { otp, otp_expiry } = generateOtop()
    const customer = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: otp_expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0
    })

    if (customer) {
        await requestOtp(otp, phone)
        const signature = generateSign({
            _id: customer._id,
            email: customer.email,
            phone: customer.phone,
        })

        res.status(201).json(({
            signature: signature,
            verified: customer.verified,
            email: customer.email
        }))

    } else {
        res.status(400).json({ err: "Something went wrong" })
    }


}

export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <CustomersLogin>req.body
    if (email && password) {
        const user = await findCustomer('', email)
        if (user) {
            let validPassword = await verifyPassword(password, user.password)
            if (validPassword) {
                const sign = generateSign({
                    _id: user._id,
                    email: user.email,
                    phone: user.phone,
                })
                return res.status(200).send({ token: sign })
            }
            return res.status(400).send({ message: "Please enter correct email and password" })
        }
        return res.status(204).send({ message: "Vendor not found" })
    }
    return res.status(400).send({ message: "Please enter your email and password" })
}

export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.User
    const { otp } = req.body
    if (customer) {
        const customerProfile = await (findCustomer(customer._id, ""))
        if (customerProfile) {
            if (customerProfile.otp == otp) {
                customerProfile.verified = true
                await customerProfile.save()
                res.status(200).json(customerProfile)
            } else {
                res.status(404).json({ message: "Otp Failed!" })
            }
        } else {
            res.status(404).json({ message: "Something went wrong!" })
        }
    } else {
        res.status(404).json({ message: "Something went wrong" })
    }
}

export const OTP = async (req: Request, res: Response, next: NextFunction) => {


}

export const CustomerProfile = async (req: Request, res: Response, next: NextFunction) => {

}

export const UpdateCutomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.User
    const { firstName, lastName, address } = req.body
    if (customer) {
        const customerProfile = await (findCustomer(customer._id, ""))
        if (customerProfile) {
            customerProfile.firstName = firstName
            customerProfile.lastName = lastName
            customerProfile.address = address
            try {
                await customerProfile.save()
                res.status(200).json(customerProfile)
            } catch (error) {
                console.error('Database error:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        } else {
            res.status(404).json({ message: "Something went wrong!" })
        }
    } else {
        res.status(404).json({ message: "Something went wrong" })
    }
}

