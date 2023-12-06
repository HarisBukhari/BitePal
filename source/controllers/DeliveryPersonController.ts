import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { CreateDeliveryUserInput, CustomersLogin, EditCustomerInputs } from '../dto'
import { generateSign, hashPassword, verifyPassword, generateSalt } from "../utilities"
import { DeliveryUser } from '../models'

export const findDeliveryPerson = async (id: string | undefined, email?: string) => {
    try {
        if (email) {
            return await DeliveryUser.findOne({ email: email })
        } else {
            return await DeliveryUser.findOne({ _id: id })
        }
    } catch (err) {
        console.error('Find Vendor Database error:', err)
    }
}

export const DeliverySignUp = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUserInputs = plainToClass(CreateDeliveryUserInput, req.body)
    const validationError = await validate(deliveryUserInputs, { validationError: { target: true } })
    if (validationError.length > 0) {
        return res.status(400).json(validationError)
    }
    const { email, phone, password, address, firstName, lastName, pincode } = deliveryUserInputs
    const salt = await generateSalt()
    const userPassword = await hashPassword(password, salt)
    const existingDeliveryUser = await DeliveryUser.findOne({ email: email })
    if (existingDeliveryUser !== null) {
        return res.status(400).json({ message: 'A Delivery User exist with the provided email ID!' })
    }
    const result = await DeliveryUser.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        address: address,
        pincode: pincode,
        verified: false,
        lat: 0,
        lng: 0,
    })
    if (result) {
        //Generate the Signature
        const signature = generateSign({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })
        // Send the result
        return res.status(201).json({ signature, verified: result.verified, email: result.email })
    }
    return res.status(400).json({ msg: 'Error while creating Delivery user' })
}

export const DeliveryLogin = async (req: Request, res: Response, next: NextFunction) => {
    const loginInputs = plainToClass(CustomersLogin, req.body)
    const validationError = await validate(loginInputs, { validationError: { target: true } })
    if (validationError.length > 0) {
        return res.status(400).json(validationError)
    }
    const { email, password } = loginInputs
    const deliveryUser = await DeliveryUser.findOne({ email: email })
    if (deliveryUser) {
        const validation = await verifyPassword(password, deliveryUser.password)
        if (validation) {
            const signature = generateSign({
                _id: deliveryUser._id,
                email: deliveryUser.email,
                verified: deliveryUser.verified
            })
            return res.status(200).json({
                signature,
                email: deliveryUser.email,
                verified: deliveryUser.verified
            })
        }
    }
    return res.json({ msg: 'Error Login' })
}

export const GetDeliveryProfile = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUser = req.User
    if (deliveryUser) {
        const profile = await DeliveryUser.findById(deliveryUser._id)
        if (profile) {
            return res.status(201).json(profile)
        }
    }
    return res.status(400).json({ msg: 'Error while Fetching Profile' })
}

export const EditDeliveryProfile = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUser = req.User
    const customerInputs = plainToClass(EditCustomerInputs, req.body)
    const validationError = await validate(customerInputs, { validationError: { target: true } })
    if (validationError.length > 0) {
        return res.status(400).json(validationError)
    }
    const { firstName, lastName, address } = customerInputs
    if (deliveryUser) {
        const profile = await DeliveryUser.findById(deliveryUser._id)
        if (profile) {
            profile.firstName = firstName
            profile.lastName = lastName
            profile.address = address
            const result = await profile.save()
            return res.status(201).json(result)
        }
    }
    return res.status(400).json({ msg: 'Error while Updating Profile' })
}

/* ------------------- Delivery Notification --------------------- */


export const UpdateDeliveryUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    const deliveryUser = req.User
    if (deliveryUser) {
        const { lat, lng } = req.body
        const profile = await DeliveryUser.findById(deliveryUser._id)
        if (profile) {
            if (lat && lng) {
                profile.lat = lat
                profile.lng = lng
            }
            profile.isAvailable = !profile.isAvailable
            const result = await profile.save()
            return res.status(201).json(result)
        }
    }
    return res.status(400).json({ msg: 'Error while Updating Profile' })
}