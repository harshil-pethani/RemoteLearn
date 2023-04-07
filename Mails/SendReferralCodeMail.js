import path from 'path';
import { fileURLToPath } from 'url';

import ejs from 'ejs';
import transporter from '../Helper/Transporter.js';

const sendReferralCodeMail = async (referralDetails) => {
    console.log("Insite Mail ");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const tempatePath = path.join(__dirname, '../Views/ReferralCodeMail.ejs');

    const data = await ejs.renderFile(tempatePath, {
        email: referralDetails.email,
        totalreferrals: referralDetails.totalreferrals,
        newreferrals: referralDetails.newreferrals,
        freecohortavailable: referralDetails.freecohortavailable,
        referralcode: referralDetails.referralcode,
        creditcode: referralDetails.creditcode
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: referralDetails.email,
        subject: "Referral Details",
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

export default sendReferralCodeMail;