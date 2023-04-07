import Notify from "../Models/Notify.js";


export const notifyCreate = {
    validator: async (req, res, next) => {
        if (!req.body.courseid || !req.body.coursename || !req.body.batchname || !req.body.batchid || !req.body.useremail) {
            return res.status(400).send("Please Fill all the Fields ");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const createNotification = await Notify.create({
                courseid: req.body.courseid,
                coursename: req.body.coursename,
                batchname: req.body.batchname,
                batchid: req.body.batchid,
                useremail: req.body.useremail.toLowerCase()
            })
            return res.status(201).send("Notification Alert Created");
        } catch (e) {
            console.log(e);
            return res.status(500).send("Notification Alert Creation failed");
        }
    }
}

export const getAllNotify = {
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const findNotify = await Notify.find();

                if (findNotify.length == 0) {
                    return res.status(400).send("Waiting Students Not Found")
                }
                return res.status(200).send(findNotify);

            } catch (e) {
                console.log(e);
                return res.status(500).send("Waiting Students fetching Failed");
            }
        } else {
            return res.status(400).send("You can't see the Waiting student details")
        }
    }
}