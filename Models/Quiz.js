import Mongoose from "mongoose";

const QuizSchema = new Mongoose.Schema(
    {
        quizanswers: {
            type: Object,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    }, { timestamps: true }
)


const Quiz = Mongoose.model("Quiz", QuizSchema);
export default Quiz;