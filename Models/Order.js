import Mongoose from "mongoose";

const OrderSchema = new Mongoose.Schema(
    {
        customerid: {
            type: String
        },
        paymentIntentId: {
            type: String
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        coursename: {
            type: String,
            required: true,
        },
        batch: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        promocode: {
            type: String,
        },
        promocodetype: {
            type: String,
        },
        discount: {
            type: Number,
            required: true
        },
        total: {
            type: Number,
            required: true
        },
        payment_status: {
            type: String,
            required: true
        }
    }, { timestamps: true }
)


const Order = Mongoose.model("Order", OrderSchema);
export default Order;