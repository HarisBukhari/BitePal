import express  from "express"
import { GetFoodAvailability, GetTopRestaurants, GetFoodIn30Min, SearchFoods, RestuarantsByID } from "../controllers"

const router = express.Router()

/* ------------------- Restaurants Section --------------------- */

router.get('/:pincode',GetFoodAvailability)
router.get('/top-restaurants/:pincode', GetTopRestaurants)
router.get('/foods-in-30-min/:pincode', GetFoodIn30Min)
router.get('/search/:pincode', SearchFoods)
router.get('/restaurant/:id', RestuarantsByID)

export { router as ShoppingRoute }