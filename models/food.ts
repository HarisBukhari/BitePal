import mongoose, { Schema, Document, Model } from "mongoose";

interface foodDoc extends Document {
    name: string;
    description: string;
    category: string;
    foodtype: string;
    readyTime: number;
    price: number;
}

const foodSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }, 
    category: { type: String, required: true },
    foodType: { type: String, required: true },
    readyTime: { type: Number, required: true },
    price: { type: Number, required: true },
},
{
    timestamps: true 
});

const Food = mongoose.model<foodDoc>('food', foodSchema)

export { Food }