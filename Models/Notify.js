import Mongoose from "mongoose";

const NotifySchema = new Mongoose.Schema(
    {
        courseid: {
            type: String,
            required: true
        },
        coursename: {
            type: String,
            required: true
        },
        batchname: {
            type: String,
            required: true
        },
        batchid: {
            type: String,
            required: true
        },
        useremail: {
            type: String,
            required: true
        }
    }, { timestamps: true }
)


const Notify = Mongoose.model("Notify", NotifySchema);
export default Notify;