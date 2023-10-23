require('dotenv').config()
import express from "express"
import { AdminRoute, VendorRoute } from "./routes"
import bodyParser from "body-parser"
import mongoose, { ConnectOptions } from "mongoose"
import { mongoDB_URI } from "./config/index"

const app = express()
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
