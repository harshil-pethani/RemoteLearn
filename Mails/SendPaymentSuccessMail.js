import path from 'path';
import { fileURLToPath } from 'url';

import ejs from 'ejs';
import transporter from '../Helper/Transporter.js';

const sendPaymentSuccessMail = async (paymentDetails) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const tempatePath = path.join(__dirname, '../Views/PaymentSuccessMail.ejs');

    const data = await ejs.renderFile(tempatePath, {
        coursename: paymentDetails.coursename,
        batchname: paymentDetails.batch,
        plantime: paymentDetails.plantime,
        orderTotal: paymentDetails.total
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: paymentDetails.email,
        subject: "Payment Success",
        html: data
    }

    transporter.sendMail(mailOptions, function (error, info) {
        console.log("Inside sendmail");
        if (error) {
            console.log(error);
        } else {
            // console.log(info)
            console.log("Email Sent");
        }
    })
}

export default sendPaymentSuccessMail;