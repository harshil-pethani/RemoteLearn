import Mongoose from "mongoose";

const ReferralSchema = new Mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        totalreferrals: {
            type: Number,
            required: true,
            default: 0
        },
        newreferrals: {
            type: Number,
            required: true,
            default: 0
        },
        freecourseavailable: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        referralcode: {
            type: String,
            required: true,
            unique: true
        },
        creditcode: {
            type: String,
            required: true,
            unique: true
        }
    }, { timestamps: true }
)


const Referral = Mongoose.model("Referral", ReferralSchema);
export default Referral;