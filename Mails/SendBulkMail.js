import path from 'path';
import { fileURLToPath } from 'url';

import ejs from 'ejs';
import transporter from '../Helper/Transporter.js';

const sendBulkMail = async (bulkMailData) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const tempatePath = path.join(__dirname, '../Views/AdminMail.ejs');

    const data = await ejs.renderFile(tempatePath, {
        mailContent: bulkMailData.mailContent,
        mailTitle: bulkMailData.mailTitle
    });

    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: bulkMailData.emailData,
        subject: bulkMailData.mailSubject,
        html: data
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("error : ", error);
        } else {
            console.log("Email Sent");
        }
    })
}

export default sendBulkMail;