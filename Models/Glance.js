import Mongoose from "mongoose";

const GlanceSchema = new Mongoose.Schema(
    {
        teachers: {
            type: Number,
            required: true
        },
        trainedstudents: {
            type: Number,
            required: true,
        },
        placedstudents: {
            type: Number,
            required: true
        }
    }
)

const Glance = Mongoose.model("Glance", GlanceSchema);
export default Glance;