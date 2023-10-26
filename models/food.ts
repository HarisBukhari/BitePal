import mongoose, { Schema, Document, Model } from "mongoose";

interface foodDoc extends Document {
    vendorId: string;
    name: string;
    description: string;
    category: string;
    foodtype: string;
    readyTime: number;
    price: number;
    rating: number;
    image: [string];
}

const foodSchema = new Schema({
    vendorId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true }, 
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number },
    price: { type: Number, required: true },
    rating: { type: Number},
    image: { type: [String]}
},
{
    toJSON:{
        transform(doc,ret){
            delete ret.__v;
            delete ret.createdAt,
            delete ret.updatedAt
        }
    },
    timestamps: true 
});

const Food = mongoose.model<foodDoc>('food', foodSchema)

export { Food }