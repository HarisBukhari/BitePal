import { Request, Response, NextFunction } from 'express'
import { Vendor } from '../models'


export const GetFoodAvailability = async (req: Request, res: Response, next: NextFunction) =>{
    const pincode = req.params.pincode
    const result = await Vendor.find({ pincode: pincode, serviceAvailable: true})
    .sort([['rating', 'descending']])
    .populate("foods")
    console.log(result)
    if(result.length > 0){
        res.status(200).json(result)
    }
    res.status(400).json({message:"No Data Available"})

}
export const GetTopRestaurants = async (req: Request, res: Response, next: NextFunction) =>{
    res.status(200).send('Hello From Shopping Controller')
}
export const GetFoodIn30Min = async (req: Request, res: Response, next: NextFunction) =>{
    res.status(200).send('Hello From Shopping Controller')
}
export const SearchFoods = async (req: Request, res: Response, next: NextFunction) =>{
    res.status(200).send('Hello From Shopping Controller')
}
export const RestuarantsByID = async (req: Request, res: Response, next: NextFunction) =>{
    res.status(200).send('Hello From Shopping Controller')
}
