import Mongoose from "mongoose";

const UserSchema = new Mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 3,
            max: 20,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            max: 50
        },
        password: {
            type: String,
            required: true
        },
        usertype: {
            type: String,
            required: true,
            default: "faculty"
        }
    }, { timestamps: true }
)


const User = Mongoose.model("User", UserSchema);
export default User;