import path from 'path';
import { fileURLToPath } from 'url';

import ejs from 'ejs';
import transporter from '../Helper/Transporter.js';

const sendForgotPassMail = async (forgotPassData) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const tempatePath = path.join(__dirname, '../Views/ForgotPasswordMail.ejs');

    const data = await ejs.renderFile(tempatePath, {
        url: forgotPassData.url,
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: forgotPassData.email,
        subject: "Password Reset URL",
        html: data
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            // console.log(info)
            console.log("Email Sent");
        }
    })
}

export default sendForgotPassMail;