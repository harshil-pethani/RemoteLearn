import sendContactMail from "../Mails/SendContactMail.js";

export const submitContact = {
    validator: async (req, res, next) => {
        if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.message) {
            return res.status(400).send("Please fill out all the Fields ");
        } else if (req.body.firstname.length < 3 || req.body.lastname.length < 3) {
            return res.status(400).send("Please Enter Valid Firstname and Lastname");
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
            return res.status(400).send("Please Enter Valid Email Address");
        } else if (req.body.message.length < 15) {
            return res.status(400).send("Please Describe your Message properly");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            await sendContactMail(req.body);
            return res.status(200).send("Thanks for filling out our form! We will Reply you shortly.");
        } catch (e) {
            // console.log(e)
            return res.status(500).send("Sorry, Something went wrong - Please try after some time.");
        }
    }
}