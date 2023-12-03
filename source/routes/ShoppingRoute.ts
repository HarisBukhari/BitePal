import express, { Request, Response, NextFunction } from "express"
import { GetFoodAvailability, GetTopRestaurants, GetFoodIn30Min, SearchFoods, RestuarantsByID, getFoods } from "../controllers"
import { Authenticate } from "../middlewares"

const router = express.Router()


router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.json({ "data": "Hello From Vendor!" })
})


/* ------------------- Restaurants Section --------------------- */

router.get('/:pincode',GetFoodAvailability)
router.get('/top-restaurants/:pincode', GetTopRestaurants)
router.get('/foods-in-30-min/:pincode', GetFoodIn30Min)
router.get('/search/:pincode', SearchFoods)
router.get('/restaurant/:id', RestuarantsByID)

export { router as ShoppingRoute }