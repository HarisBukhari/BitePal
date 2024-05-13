import express from "express"
import App from '../services/ExpressApp'

const StartServer = async () => {
    const app = express()
    await App(app)
    return app
}

export const app =  StartServer()