import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";


import AuthRoute from "./Routes/AuthRoute.js";
import BannerRoute from "./Routes/BannerRoute.js";
import CourseRoute from "./Routes/CourseRoute.js";
import ReferralRoute from "./Routes/ReferralRoute.js";
import contactRoute from "./Routes/ContactRoute.js";
import notifyRoute from "./Routes/NotifyRoute.js";
import subscribeRoute from "./Routes/SubscribeRoute.js";
import checkoutRoute from "./Routes/CheckoutRoute.js";
import studentRoute from "./Routes/StudentRoute.js";
import transactionRoute from "./Routes/TransactionRoute.js";
import glanceRoute from "./Routes/GlanceRoute.js";
import QuizRoute from "./Routes/QuizRoute.js";

import cookieParser from "cookie-parser";
import cors from "cors";

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ['https://rich-ruby-jay-tux.cyclic.app', 'http://localhost:3000'],
    methods: ["GET", "PUT", "POST", "DELETE"],
}))
app.use(cookieParser());
const port = process.env.PORT || 5000;

app.use("/api/auth", AuthRoute);
app.use("/api/banner", BannerRoute);
app.use("/api/course", CourseRoute);
app.use("/api/referral", ReferralRoute);
app.use("/api/notify", notifyRoute);
app.use("/api/contact", contactRoute);
app.use("/api/glance", glanceRoute);
app.use("/api/quiz", QuizRoute);
app.use("/api/student", studentRoute);
app.use("/api/transaction", transactionRoute);
app.use("/api/checkout", checkoutRoute);

app.use("/api/subscribe", subscribeRoute);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected With DB Successfull"))
    .catch((e) => console.log("Db Connection Failed", e));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "/client/build")));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is Listening on PORT ${port}`);
})



// stripe listen --forward-to localhost:5000/api/checkout/webhook