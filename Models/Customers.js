import Mongoose from "mongoose";

const CustomerSchema = new Mongoose.Schema(
    {
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
        }
    }, { timestamps: true }
)

const Customer = Mongoose.model("Customer", CustomerSchema);
export default Customer;