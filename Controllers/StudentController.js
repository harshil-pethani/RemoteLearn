import Customer from "../Models/Customers.js";
import Order from "../Models/Order.js";
import sendBulkMail from "../Mails/SendBulkMail.js";

// export const customerAdd = {
//     validator: async (req, res, next) => {
//         if (!req.body.username || !req.body.email || !req.body.plantitle || !req.body.plandate || !req.body.plantime) {
//             return res.status(400).send("Please Fill all the Fields");
//         }
//         next();
//     },
//     controller: async (req, res) => {
//         try {
//             const addCustomer = await Customer.create({
//                 username: req.body.username,
//                 email: req.body.email,
//                 plantitle: req.body.plantitle,
//                 plandate: req.body.plandate,
//                 plantime: req.body.plantime
//             })
//             return res.status(201).send("Customer Added Successful");
//         } catch (e) {
//             console.log(e);
//             return res.status(500).send("Customer Add failed");
//         }
//     }
// }

export const allCustomer = {
    controller: async (req, res) => {
        try {
            const findAllCustomers = await Customer.find();
            return res.status(200).send(findAllCustomers);
        } catch (e) {
            console.log(e);
            return res.status(500).send("Student details Getting Failed");
        }

    }
}

export const allTransactions = {
    controller: async (req, res) => {
        console.log(req.currUser)
        if (req.currUser.usertype === "owner") {
            try {
                const findAllTransactions = await Order.find();
                return res.status(200).send(findAllTransactions);
            } catch (e) {
                console.log(e);
                return res.status(500).send("Transactions Getting Failed");
            }
        } else {
            return res.status(400).send("You can't see the Transaction details")
        }
    }
}

export const deleteCustomer = {
    validator: async (req, res, next) => {
        if (!req.params.id) {
            return res.status(400).send("Invalid Customer id");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                await Customer.findByIdAndDelete(req.params.id);

                return res.status(200).send("student Deleted Successful");
            } catch (e) {
                console.log(e);
                return res.status(500).send("student Delete failed");
            }
        } else {
            return res.status(400).send("You can't delete the student details")
        }
    }
}


export const sendBulkMailController = {
    validator: async (req, res, next) => {
        if (!req.body.emailData || !req.body.mailContent || !req.body.mailTitle || !req.body.mailSubject) {
            return res.status(400).send("Please fill out all the fields")
        } else if (req.body.mailContent.length < 10) {
            return res.status(400).send("Mail Content should be more than 10 characters.");
        } else {
            if (Array.isArray(req.body.emailData)) {
                req.body.emailData.forEach(mailId => {
                    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mailId))) {
                        return res.status(400).send("Please Enter Valid Email Address");
                    }
                });
            } else {
                if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.emailData))) {
                    return res.status(400).send("Please Enter Valid Email Address");
                }
            }
        }
        next();
    },
    controller: async (req, res) => {
        try {
            await sendBulkMail(req.body);
            return res.status(200).send("Mail has been sent to all the students");
        } catch (e) {
            console.log(e)
            return res.status(500).send("Sorry, Something went wrong - Please try after some time.");
        }
    }
}

