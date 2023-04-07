import Mongoose from "mongoose";

const BannerSchema = new Mongoose.Schema(
    {
        bannertext: {
            type: String,
            required: true,
        },
        startdate: {
            type: String,
            required: true,
        },
        enddate: {
            type: String,
            required: true
        },
        bannercode: {
            type: String,
            required: true
        },
        discount: {
            type: Number,
            required: true
        },
        isrunning: {
            type: Boolean,
            default: true
        }
    }, { timestamps: true }
)


const Banner = Mongoose.model("Banner", BannerSchema);
export default Banner;