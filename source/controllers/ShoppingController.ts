import { Request, Response, NextFunction } from 'express'
import { Vendor, foodDoc } from '../models'
import { NotFoundError } from '../error'


export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode
        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']])
            .populate("foods")
        if (result.length > 0) {
            res.status(200).json(result)
        }
        throw new NotFoundError('Vendors Not Found!', 'Shopping/GetFoodAvailability')
    } catch (err) {
        next(err)
    }
}


export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode
        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .sort([['rating', 'descending']])
            .limit(10)
        if (result.length > 0) {
            res.status(200).json(result)
        }
        throw new NotFoundError('Vendors Not Found!', 'Shopping/GetTopRestaurants')
    } catch (err) {
        next(err)
    }
}
export const GetFoodIn30Min = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode
        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .populate("foods")
        if (result.length > 0) {
            let foodResult: any = []
            result.map(vandor => {
                const food = vandor.foods as [foodDoc]
                foodResult.push(...food.filter(food => food.readyTime <= 30))
            })
            res.status(200).json(foodResult)
        }
        throw new NotFoundError('Vendors Not Found!', 'Shopping/GetFoodIn30Min')
    } catch (err) {
        next(err)
    }
}


export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pincode = req.params.pincode
        const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
            .populate("foods")
        if (result.length > 0) {
            let foodResult: any = []
            result.map(vandor => {
                const food = vandor.foods as [foodDoc]
                foodResult.push(...food)
            })
            res.status(200).json(foodResult)
        }
        throw new NotFoundError('Vendors Not Found!', 'Shopping/SearchFoods')

    } catch (err) {
        next(err)
    }
}


export const RestuarantsByID = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const result = await Vendor.findOne({ _id: id })
            .populate("foods")
        if (result) {
            res.status(200).json(result)
        }
        throw new NotFoundError('Vendors Not Found!', 'Shopping/RestuarantsByID')
    } catch (err) {
        next(err)
    }
}
