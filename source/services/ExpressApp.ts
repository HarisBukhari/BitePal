import express, { Application, Request, Response, NextFunction } from "express"
import { AdminRoute, VendorRoute, ShoppingRoute, CustomerRoute, DeliveryRoute } from "../routes"
import path from 'path'
import helmet from "helmet"
import cors from "cors"
import xss from "xss-clean"
import rateLimiter from "express-rate-limit"

export default async (app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.set('trust proxy', 1)
    app.use(
        rateLimiter({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
        })
    )
    app.use(express.json())
    app.use(helmet())
    app.use(cors())
    app.use(xss())
    app.use('/images', express.static(path.join(__dirname, '/images')))
    app.use("/admin", AdminRoute)
    app.use("/vendor", VendorRoute)
    app.use("/shopping", ShoppingRoute)
    app.use("/customer", CustomerRoute)
    app.use("/deliveryPerson", DeliveryRoute)
    
    //Document
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
        const postmanDocURL = 'https://documenter.getpostman.com/view/22277285/2s9YeN2U1H'
        res.redirect(postmanDocURL)
    })

    return app
}


