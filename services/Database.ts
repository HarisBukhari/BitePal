import mongoose from "mongoose"
import { mongoDB_URI } from "../config/index"

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

export default async () => {
    try {
        await mongoose.connect(mongoDB_URI, options as any)
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);

    }
}


