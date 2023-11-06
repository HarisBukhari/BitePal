import mongoose, { Schema, Document, Model } from "mongoose";

interface CustomerDoc extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    address: string;
    phone: string;
    salt: string;
    verified: boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng: number;
}

const CustomerSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: true },
    addresses: { type: String },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    verified: { type: Boolean, required: true },
    otp: { type: String, required: true },
    otp_expiry: { type: Date, required: true }, 
    lat: { type: Number },
    lng: { type: Number },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
})

const Customer = mongoose.model<CustomerDoc>('Customer', CustomerSchema)

export { Customer }