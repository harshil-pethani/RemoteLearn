import { Router } from 'express';
const router = Router();
import mailchimp from "@mailchimp/mailchimp_marketing";

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_ZONE,
});


router.post("/add", async (req, res) => {
    // console.log("INside Subscribe")
    try {
        if (!req.body.email) {
            return res.status(400).send("Please fill the Email Address properly");
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
            return res.status(400).send("Please fill the Email Address properly");
        }

        const response = await mailchimp.lists.addListMember(process.env.MAILCHIMP_LIST_ID, {
            email_address: req.body.email.toLowerCase(),
            status: "subscribed",
        });

        return res.status(200).send("Thank you for Subscribing our NewsLetter.");

    } catch (e) {
        // console.log(e);
        if (e.status === 400) {
            return res.status(400).send("You have already subscribed our NewsLetter.");
        }
        return res.status(500).send("Sorry, Something went wrong - Please try after some time.");
    }
});

export default router;

