import mongoose, { Schema, Document } from 'mongoose'

enum OrderStatus {
    Pending = 'Pending',
    Confirmed = 'Confirmed',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Cancelled = 'Cancelled',
}

export interface OrderDoc extends Document {
    orderId: string
    vendorId: string
    items: [any]
    totalAmount: number
    paidAmount: number
    orderDate: Date
    orderStatus: OrderStatus
    remarks: string
    deliveryId: string
    readyTime: number
}


const OrderSchema = new Schema({
    orderId: { type: String, require: true },
    vendorId: { type: String, require: true },
    items: [
        {
            food: { type: Schema.Types.ObjectId, ref: "food", require: true },
            unit: { type: Number, require: true }
        }
    ],
    totalAmount: { type: Number, require: true },
    paidAmount: { type: Number, require: true },
    orderDate: { type: Date },
    orderStatus: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Pending,
    },
    remarks: { type: String },
    deliveryId: { type: String },
    readyTime: { type: Number },
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v
            delete ret.createdAt
            delete ret.updatedAt

        }
    },
    timestamps: true
})


const Order = mongoose.model<OrderDoc>('order', OrderSchema)

export { Order }