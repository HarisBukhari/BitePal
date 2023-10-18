import express from "express"
require('dotenv').config()
import {AdminRoute,VandorRoute} from "./routes/index"

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(AdminRoute)
app.use(VandorRoute)



app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})
