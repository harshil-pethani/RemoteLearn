import Mongoose from "mongoose";

const BatchSchema = new Mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        startdate: {
            type: String,
            required: true,
        },
        enddate: {
            type: String,
            required: true,
        },
        batchstatus: {
            type: String,
            required: true,
        },
        starttime: {
            type: String,
            required: true
        },
        endtime: {
            type: String,
            required: true
        }
    }, { timestamps: true }
)

const Batch = Mongoose.model("Batch", BatchSchema);
export default Batch;