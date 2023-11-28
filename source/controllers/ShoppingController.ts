import { Request, Response, NextFunction } from 'express'
import { Vendor, foodDoc } from '../models'


export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode
    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .populate("foods")
    if (result.length > 0) {
        res.status(200).json(result)
    }else{
        res.status(400).json({ message: "No Data Available" })
    }

}
export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) => {
    const pincode = req.params.pincode
    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true })
        .sort([['rating', 'descending']])
        .limit(10)
    if (result.length > 0) {
        res.status(200).json(result)
    }else{
        res.status(400).json({ message: "No Data Available" })
    }
}
export const GetFoodIn30Min = async (req: Request, res: Response, next: NextFunction) => {
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
    }else{
        res.status(400).json({ message: "No Data Available" })
    }
}
export const SearchFoods = async (req: Request, res: Response, next: NextFunction) => {
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
    }else{
        res.status(400).json({ message: "No Data Available" })
    }
}
export const RestuarantsByID = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id
    const result = await Vendor.findOne({ _id: id})
        .populate("foods")
    if (result) {
        res.status(200).json(result)
    }else{
        res.status(400).json({ message: "No Data Available" })
    }
}
