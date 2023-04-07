import { Router } from 'express';
import express from 'express';
const router = Router();
import Stripe from 'stripe';
import Order from '../Models/Order.js';
import Customer from '../Models/Customers.js';
import Batch from "../Models/Batch.js";
import Referral from '../Models/Referral.js';
import sendPaymentSuccessMail from '../Mails/SendPaymentSuccessMail.js';
import dotenv from "dotenv";
import Course from '../Models/Course.js';
dotenv.config();

const getDate = (curDate) => {
    let date, month, year;
    if (curDate)
        [year, month, date] = curDate?.split("-");

    if (month == '01')
        month = 'Jan';
    else if (month == '02')
        month = 'Feb';
    else if (month == '03')
        month = 'March';
    else if (month == '04')
        month = 'April';
    else if (month == '05')
        month = 'May';
    else if (month == '06')
        month = 'June';
    else if (month == '07')
        month = 'July';
    else if (month == '08')
        month = 'Aug';
    else if (month == '09')
        month = 'Sept';
    else if (month == '10')
        month = 'Oct';
    else if (month == '11')
        month = 'Nov';
    else if (month == '12')
        month = 'Dec';

    return date + " " + month + ", " + year
}

const stripePay = new Stripe(process.env.STRIPE_KEY, {
    maxNetworkRetries: 10
});


router.post('/create-checkout-session', async (req, res) => {
    let userName = req.body.email.substring(0, req.body.email.indexOf('@'));
    let userDomain = req.body.email.substring(req.body.email.indexOf('@') + 1);

    userName = userName.split('.').join("");
    let userEmail = userName + '@' + userDomain;

    // console.log(req.body);

    const customer = await stripePay.customers.create({
        metadata: {
            username: req.body.username,
            email: userEmail.toLowerCase(),
            coursename: req.body.userSelectedCourse.title,
            courseprice: req.body.userSelectedCourse.price,
            discount: req.body.discount,
            promocode: req.body.promocode.toLowerCase(),
            promocodetype: req.body.promocodetype,
            batch: req.body.userSelectedBatch.name,
        }
    })

    const session = await stripePay.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: req.body.userSelectedCourse.title,
                        description: req.body.userSelectedCourse.description
                    },
                    unit_amount: req.body.finalPrice * 100,
                },
                quantity: 1,
            },
        ],
        payment_method_types: ["card"],
        customer: customer.id,
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/services/checkout-success/${req.body.userSelectedCourse._id}/${req.body.userSelectedBatch._id}/${req.body.userSelectedCourse.price}`,
        cancel_url: `${process.env.CLIENT_URL}/checkout-failure`,
    });

    res.send({ url: session.url });

});

const createOrder = async (customer, data) => {
    try {
        const newOrder = await Order.create({
            customerid: data.customer,
            paymentIntentId: data.payment_intent,
            username: customer.metadata.username,
            email: customer.metadata.email.toLowerCase(),
            coursename: customer.metadata.coursename,
            batch: customer.metadata.batch,
            promocode: customer.metadata.promocode?.toLowerCase() || "None",
            promocodetype: customer.metadata.promocodetype || "None",
            price: customer.metadata.courseprice,
            discount: customer.metadata.discount,
            total: data.amount_total / 100,
            payment_status: data.payment_status
        })

        if (newOrder)
            await sendPaymentSuccessMail(newOrder);
        console.log("Order Created")
    }
    catch (e) {
        console.log(e);
    }
}


const addCustomer = async (customer, data) => {
    try {
        const addCustomer = await Customer.create({
            username: customer.metadata.username,
            email: customer.metadata.email.toLowerCase(),
            coursename: customer.metadata.coursename,
            batch: customer.metadata.batch,
        })

        // return res.status(201).send
        console.log("Customer Added Successful");
    } catch (e) {
        console.log(e);
        // return res.status(500).
        console.log("Customer Add failed");
    }
}

const countReferral = async (customer, data) => {
    try {
        // console.log("Inside Count Referral");
        let userName = customer.metadata.email.toLowerCase().substring(0, customer.metadata.email.toLowerCase().indexOf('@'));
        let userDomain = customer.metadata.email.toLowerCase().substring(customer.metadata.email.toLowerCase().indexOf('@') + 1);

        userName = userName.split('.').join("");
        let userEmail = userName + '@' + userDomain;

        const findReferral = await Referral.findOne({ referralcode: customer.metadata.promocode.toLowerCase() });

        const findOrder = await Order.find({ email: userEmail });

        if (findOrder.length > 0) {
            console.log("Old User Count");
            return "complete";
        }
        else if (findReferral && findReferral.email !== userEmail) {
            let totalReferrals = findReferral.totalreferrals + 1;
            let newReferrals = findReferral.newreferrals + 1;
            let freecourseavailable = findReferral.freecourseavailable;
            // console.log("Inside findReferral")
            if (newReferrals === 5) {
                newReferrals = 0;
                freecourseavailable = freecourseavailable + 1;
            }

            const updateReferral = await Referral.findOneAndUpdate({ referralcode: customer.metadata.promocode.toLowerCase() }, {
                totalreferrals: totalReferrals,
                newreferrals: newReferrals,
                freecourseavailable: freecourseavailable
            }, { new: true })

            console.log("Referral Counted");
            return "complete";

        } else {
            console.log("Invalid Referral Code");
            return "complete";
        }
    } catch (e) {
        console.log(e)
        // console.log("Referral Count Failed");
        return "complete";
    }
}

const useCredits = async (customer, data) => {
    try {
        const findReferral = await Referral.findOne({ creditcode: customer.metadata.promocode.toLowerCase() });

        if (findReferral) {
            const updateReferral = await Referral.findOneAndUpdate({ creditcode: customer.metadata.promocode.toLowerCase() }, {
                freecohortavailable: findReferral.freecohortavailable - 1
            }, { new: true })

            console.log("Credit Used Successfully");

        } else {
            console.log("Invalid CreditCode");
        }

    } catch (e) {
        console.log(e);
        console.log("Credit Use Failed");
    }
}

let endpointSecret;
// endpointSecret = "whsec_5046afe8dd2959e09b9a36084339216f326c32c104358bee5ae007335c09e0c1";

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, response) => {
    const sig = req.headers['stripe-signature'];

    console.log("Webhook")

    let data;
    let eventType;
    if (endpointSecret) {
        let event;
        try {
            event = stripePay.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log(event)
            console.log("Webhook Verified");
        } catch (err) {
            console.log("Webhook Verified failed");
            console.log("Errror", err.message);
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        data = event.data.object;
        eventType = event.type;
    } else {
        data = req.body.data.object;
        eventType = req.body.type;
    }


    // Handle the event
    if (eventType === "checkout.session.completed") {
        try {

            const customer = await stripePay.customers.retrieve(data.customer)

            if (customer.metadata.promocodetype === "referralcode") {
                // console.log("Counting Referral");
                const responseRef = await countReferral(customer, data);
                if (responseRef === "complete") {
                    createOrder(customer, data);
                    addCustomer(customer, data);
                }
            } else {
                createOrder(customer, data);
                addCustomer(customer, data);
            }

        } catch (err) {
            console.log(err.message);
        }
    }
    response.send().end();
});

router.post("/purchasedcohort", async (req, res) => {
    try {
        const findCourse = await Course.findById(req.body.courseid);

        let findBatch = await Batch.findById(req.body.batchid);

        return res.status(200).send({ findCourse: findCourse, findBatch: findBatch });

    } catch (e) {
        console.log(e);
        return res.status(500).send("Error");
    }
});

router.post("/zeroprice", async (req, res) => {
    try {

        let userName = req.body.email.substring(0, req.body.email.indexOf('@'));
        let userDomain = req.body.email.substring(req.body.email.indexOf('@') + 1);

        userName = userName.split('.').join("");
        let userEmail = userName + '@' + userDomain;
        const findUserCredit = await Referral.findOne({ creditcode: req.body.promocode.toLowerCase() });

        if (!findUserCredit) {
            return res.status(400).send("Invalid Promocode");
        }

        if (findUserCredit && findUserCredit.email === userEmail) {
            if (findUserCredit.freecourseavailable <= 0) {
                return res.status(400).send("Insufficient Skill Share to get Free Course");
            } else {
                const newOrder = await Order.create({
                    customerid: "NA",
                    paymentIntentId: "NA",
                    username: req.body.username,
                    email: req.body.email.toLowerCase(),
                    coursename: req.body.userSelectedCourse.title,
                    price: req.body.userSelectedCourse.price,
                    discount: req.body.discount,
                    promocode: req.body.promocode?.toLowerCase() || "None",
                    promocodetype: req.body.promocodetype || "None",
                    batch: req.body.userSelectedBatch.name,
                    total: 0,
                    payment_status: "Success"
                })

                if (newOrder)
                    await sendPaymentSuccessMail(newOrder);

                console.log("Order Created Successfull");

                const addCustomer = await Customer.create({
                    username: req.body.username,
                    email: req.body.email.toLowerCase(),
                    coursename: req.body.userSelectedCourse.title,
                    batch: req.body.userSelectedBatch.name
                })
                console.log("Customer Added Successful");

                const updateReferral = await Referral.findOneAndUpdate({ creditcode: req.body.promocode.toLowerCase() }, {
                    freecourseavailable: findUserCredit.freecourseavailable - 1
                }, { new: true })

                console.log("Credit Used Successful");

                return res.status(200).send(`/services/checkout-success/${req.body.userSelectedCourse._id}/${req.body.userSelectedBatch._id}/0`)
            }
        } else {
            return res.status(400).send("Credit Code is Associated with different Email Address");
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send("Error");
    }
});

export default router;