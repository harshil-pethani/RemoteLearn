import path from 'path';
import { fileURLToPath } from 'url';

import ejs from 'ejs';
import transporter from '../Helper/Transporter.js';

const sendSlotMail = async (slotDetails) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const tempatePath = path.join(__dirname, '../Views/SlotMail.ejs');

    const data = await ejs.renderFile(tempatePath, {
        name: slotDetails.useremail,
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: slotDetails.useremail,
        subject: "Slot Available to Book",
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

export default sendSlotMail;