require('dotenv').config()
import express from "express"
import App from './services/ExpressApp'
import dbConnection from './services/Database'

const StartServer = async () => {
    const app = express()
    await App(app)
    app.listen(process.env.PORT, async () => {
        // console.clear()
        await dbConnection()
        console.log(`Server is running on port ${process.env.PORT}`)
    })
}


StartServer()