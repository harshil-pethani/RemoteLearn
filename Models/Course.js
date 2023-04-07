import Mongoose from "mongoose";

const CourseSchema = new Mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        topics: {
            type: String,
            required: true,
        },
        courseduration: {
            type: Number,
            required: true
        },
        dailytime: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        batches: {
            type: Array
        },
        status: {
            type: String,
            required: true
        },
        faculty: {
            type: String,
            required: true
        }
    }, { timestamps: true }
)


const Course = Mongoose.model("Course", CourseSchema);
export default Course;