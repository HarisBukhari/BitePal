import mongoose, { Schema, Document, Model } from "mongoose";

interface vendorDoc extends Document {
    name: string;
    ownerName: string;
    foodType: [string];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salary: string;
    serviceAvailable: boolean;
    coverImage: [string];
    rating: number;
    // food: any;
}

const vendorSchema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: { type: [String] },
    pincode: { type: String, required: true },
    addresses: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImage: { type: [String] },
    rating: { type: Number },
    // foods: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'foods' }]
}, {
    toJSON: {
        transform(doc,ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
})

const Vendor = mongoose.model<vendorDoc>('vendor', vendorSchema)

export { Vendor }