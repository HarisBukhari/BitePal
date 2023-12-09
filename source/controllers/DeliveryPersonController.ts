import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { CreateDeliveryUserInput, CustomersLogin, EditCustomerInputs } from '../dto'
import { generateSign, hashPassword, verifyPassword, generateSalt } from "../utilities"
import { DeliveryUser } from '../models'
import { BadRequestError, CustomError, NotFoundError } from '../error'

export const findDeliveryPerson = async (id: string | undefined, email?: string) => {
    try {
        if (email) {
            return await DeliveryUser.findOne({ email: email })
        }
        if (id) {
            return await DeliveryUser.findOne({ _id: id })
        }
        throw new BadRequestError('Invalid inputs', 'DeliveryPerson/findDeliveryPerson')
    } catch (err) {
        if (err instanceof BadRequestError) {
            throw err
        }
        throw new CustomError('An unexpected error occurred', 'DeliveryPerson/findDeliveryPerson')
    }
}

export const DeliverySignUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryUserInputs = plainToClass(CreateDeliveryUserInput, req.body)
        const validationError = await validate(deliveryUserInputs, { validationError: { target: true } })
        if (validationError.length > 0) {
            throw new BadRequestError('Invalid inputs', 'DeliveryPerson/DeliverySignUp')
        }
        const { email, phone, password, address, firstName, lastName, pincode } = deliveryUserInputs
        const salt = await generateSalt()
        const userPassword = await hashPassword(password, salt)
        const existingDeliveryUser = await DeliveryUser.findOne({ email: email })
        if (existingDeliveryUser !== null) {
            throw new BadRequestError('A Delivery User exist with the provided email ID!', 'DeliveryPerson/DeliverySignUp')
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
        throw new CustomError('Something went wrong!', 'DeliveryPerson/DeliverySignUp')
    } catch (err) {
        next(err)
    }
}

export const DeliveryLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const loginInputs = plainToClass(CustomersLogin, req.body)
        const validationError = await validate(loginInputs, { validationError: { target: true } })
        if (validationError.length > 0) {
            throw new BadRequestError('Invalid Inputs!', 'DeliveryPerson/DeliveryLogin')
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
            throw new BadRequestError('Invalid Inputs!', 'DeliveryPerson/DeliveryLogin')
        }
        throw new NotFoundError('Delivery Person Not Found!', 'DeliveryPerson/DeliveryLogin')
    } catch (err) {
        next(err)
    }
}

export const GetDeliveryProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryUser = req.User
        if (deliveryUser) {
            const profile = await DeliveryUser.findById(deliveryUser._id)
            if (profile) {
                return res.status(201).json(profile)
            }
            throw new NotFoundError('Delivery Person Not Found!', 'DeliveryPerson/GetDeliveryProfile')
        }
        throw new BadRequestError('Delivery Person Not Found!', 'DeliveryPerson/GetDeliveryProfile')
    } catch (err) {
        next(err)
    }
}

export const EditDeliveryProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deliveryUser = req.User
        const customerInputs = plainToClass(EditCustomerInputs, req.body)
        const validationError = await validate(customerInputs, { validationError: { target: true } })
        if (validationError.length > 0) {
            throw new BadRequestError('Invalid Inputs!', 'DeliveryPerson/EditDeliveryProfile')
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
            throw new NotFoundError('Delivery Person Not Found!', 'DeliveryPerson/EditDeliveryProfile')
        }
        throw new BadRequestError('Invalid Inputs!', 'DeliveryPerson/EditDeliveryProfile')
    } catch (err) {
        next(err)
    }
}

/* ------------------- Delivery Notification --------------------- */


export const UpdateDeliveryUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
            throw new NotFoundError('Delivery Person Not Found!', 'DeliveryPerson/UpdateDeliveryUserStatus')
        }
        throw new BadRequestError('Invalid Inputs!', 'DeliveryPerson/UpdateDeliveryUserStatus')
    } catch (err) {
        next(err)
    }
}