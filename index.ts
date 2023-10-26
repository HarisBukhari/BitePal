require('dotenv').config()
import express from "express"
import { AdminRoute, VendorRoute } from "./routes"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import { mongoDB_URI } from "./config/index"
import path from 'path'

const app = express()
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/images', express.static(path.join(__dirname, '/images')))

app.use("/admin", AdminRoute)
app.use("/vendor", VendorRoute)


mongoose.connect(mongoDB_URI, options as any)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    })


app.listen(process.env.PORT, async () => {
    console.clear()
    console.log(`Server is running on port ${process.env.PORT}`)
})
