require('dotenv').config()
import express from "express"
import App from './services/ExpressApp'
import dbConnection from './services/Database'

export const app = express()

const StartServer = async () => {
    await App(app)
    app.listen(process.env.PORT||3000, async () => {
        // console.clear()
        await dbConnection()
        console.log(`Server is running on port ${process.env.PORT||3000}`)
    })
}

StartServer()