import path from 'path';
import { fileURLToPath } from 'url';

import ejs from 'ejs';
import transporter from '../Helper/Transporter.js';

const sendContactMail = async (contactDetails) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const tempatePath = path.join(__dirname, '../Views/ContactMail.ejs');

    const data = await ejs.renderFile(tempatePath, {
        firstname: contactDetails.firstname,
        lastname: contactDetails.lastname,
        email: contactDetails.email,
        message: contactDetails.message,
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: "Contact Us Form",
        html: data
    }

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            // console.log(info)
            console.log("Email Sent");
        }
    })
}

export default sendContactMail;