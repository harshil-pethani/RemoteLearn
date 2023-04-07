import JWT from 'jsonwebtoken';
import User from "../Models/User.js";

const VerifyToken = async (req, res, next) => {
    try {
        // const token = req.headers.cookie.split("=")[1];
        const token = req.cookies?.remotelearn;
        // console.log(req.cookies);

        if (token) {
            // const token = authHeader.split(" ")[1];
            // console.log(token);
            const verified = JWT.verify(token, process.env.JWT_SEC_KEY);
            // console.log(verified)
            const currUser = await User.findOne({
                _id: verified.id
            });

            // console.log(currUser);
            if (!currUser) {
                return res.status(400).send("Unauthorized User")
            }

            req.token = token;
            let { password, ...rest } = currUser._doc;

            req.currUser = rest;
            req.userId = currUser._id;

            next();

        } else {
            // console.log("first")
            return res.status(201).send("Admin not Logged In")
        }
    } catch (err) {
        console.log(err);
        res.status(400).send("Unauthorized User");
    }
}

export default VerifyToken;