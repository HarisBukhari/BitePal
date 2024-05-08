import mongoose from "mongoose"

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

export default async () => {
    try {
        await mongoose.connect(process.env.mongoDB_URI, options as any)
        console.log('Connected to MongoDB')
    } catch (err) {
        console.error('Error connecting to MongoDB:', err)

    }
}


