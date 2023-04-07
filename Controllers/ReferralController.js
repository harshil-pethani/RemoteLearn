import Referral from "../Models/Referral.js";
import referralCodeGenerator from "referral-code-generator";
import { v4 as uuidv4 } from 'uuid';
import Banner from "../Models/Banner.js";
import Order from "../Models/Order.js";
import sendReferralCodeMail from "../Mails/SendReferralCodeMail.js";


export const getReferralCode = {
    validator: async (req, res, next) => {
        if (!req.body.email) {
            return res.status(400).send("Please fill the email address");
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email))) {
            return res.status(400).send("Please enter valid email address");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            let userName = req.body.email.substring(0, req.body.email.indexOf('@'));
            let userDomain = req.body.email.substring(req.body.email.indexOf('@') + 1);

            userName = userName.split('.').join("");
            let userEmail = userName + '@' + userDomain;

            const findReferral = await Referral.findOne({ email: userEmail.toLowerCase() });

            if (findReferral) {

                await sendReferralCodeMail(findReferral);
                return res.status(200).send("We have emailed you the referral code");
            } else {
                let newReferralCode = referralCodeGenerator.custom('lowercase', 6, 4, userName.substring(0, 4) + userDomain.split('.')[0]);

                // console.log(newReferralCode);

                let newCreditCode = newReferralCode + uuidv4().split('-')[0];
                // console.log(newCreditCode);

                const newReferral = await Referral.create({
                    email: userEmail.toLowerCase(),
                    referralcode: newReferralCode,
                    creditcode: newCreditCode
                })
                // console.log("newReferral");

                await sendReferralCodeMail(newReferral);
                return res.status(200).send("We have emailed you the referral code");
            }
        } catch (e) {
            console.log(e);
            return res.status(500).send("Sorry, Something went wrong - Please try after some time.");
        }
    }
}

export const checkReferral = {
    validator: async (req, res, next) => {
        if (!req.body.referralcode) {
            return res.status(400).send("Please fill the referral code");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const findReferral = await Referral.findOne({ referralcode: req.body.referralcode.toLowerCase() });

            if (findReferral) {
                const { creditcode, ...others } = findReferral._doc;
                return res.status(200).send(others);
            } else {
                return res.status(400).send("Invalid referral code");
            }
        } catch (e) {
            console.log(e);
            return res.status(500).send("Sorry, Something went wrong - Please try after some time.");
        }
    }
}



// export const addReferral = {
//     validator: async (req, res, next) => {
//         if (!req.body.referralcode) {
//             return res.status(400).send("Please Fill the Referral Code");
//         }
//         next();
//     },
//     controller: async (req, res) => {
//         try {
//             const findReferral = await Referral.findOne({ referralcode: req.body.referralcode.toLowerCase() });

//             if (findReferral) {
//                 let totalReferrals = findReferral.totalreferrals + 1;
//                 let newReferrals = findReferral.newreferrals + 1;
//                 let creditEarned = findReferral.creditearned;

//                 if (newReferrals === 5) {
//                     newReferrals = 0;
//                     creditEarned = creditEarned + 500;
//                 }

//                 const updateReferral = await Referral.findByIdAndUpdate(findReferral._id, {
//                     totalreferrals: totalReferrals,
//                     newreferrals: newReferrals,
//                     creditearned: creditEarned
//                 }, { new: true })

//                 return res.status(200).send(updateReferral);

//             } else {
//                 return res.status(400).send("Invalid Referral Code");
//             }

//         } catch (e) {
//             console.log(e);
//             return res.status(500).send("Referral Check Failed");
//         }
//     }
// }

// export const useCredits = {
//     validator: async (req, res, next) => {
//         if (!req.body.creditcode || !req.body.creditused) {
//             return res.status(400).send("Please Fill the all the fields");
//         }
//         next();
//     },
//     controller: async (req, res) => {
//         try {
//             const findReferral = await Referral.findOne({ creditcode: req.body.creditcode.toLowerCase() });

//             if (findReferral) {
//                 if (findReferral.creditearned == 0) {
//                     return res.status(400).send("You have zero Credits");
//                 }

//                 if (req.body.creditused <= findReferral.creditearned) {
//                     const updateReferral = await Referral.findOneAndUpdate({ creditcode: req.body.creditcode }, {
//                         creditearned: findReferral.creditearned - req.body.creditused
//                     }, { new: true })

//                     return res.status(200).send({
//                         updateReferral
//                     });
//                 } else {
//                     return res.status(400).send("Insufficient Credit");
//                 }

//             } else {
//                 return res.status(400).send("Invalid creditcode Code");
//             }
//         } catch (e) {
//             console.log(e);
//             return res.status(500).send("Creditcode Apply Failed");
//         }
//     }
// }

export const getFinalPrice = {
    validator: async (req, res, next) => {
        if (!req.body.promocode || !req.body.email || !req.body.price) {
            return res.status(400).json({
                message: "Please Fill the all the fields"
            });
        }
        next();
    },
    controller: async (req, res) => {
        try {
            let userName = req.body.email.substring(0, req.body.email.indexOf('@'));
            let userDomain = req.body.email.substring(req.body.email.indexOf('@') + 1);

            userName = userName.split('.').join("");
            let userEmail = userName + '@' + userDomain;


            const findReferral = await Referral.findOne({ referralcode: req.body.promocode.toLowerCase() });

            if (findReferral) {
                if (findReferral.email === userEmail) {
                    return res.status(400).json({
                        message: "You cannot use your own Refferal Code"
                    })
                }
                const findOrder = await Order.find({ email: userEmail });
                console.log(findOrder);
                if (findOrder.length > 0) {
                    // console.log("Old User");
                    return res.status(400).json({
                        message: "Invalid code"
                    })
                }
                return res.status(200).json({
                    finalprice: req.body.price,
                    promocodetype: "referralcode",
                    message: "Referral Code is Validated"
                })
            }

            const findUserCredit = await Referral.findOne({ creditcode: req.body.promocode.toLowerCase() });

            if (findUserCredit) {
                if (findUserCredit.email === userEmail) {
                    // let curPrice = req.body.price;

                    if (findUserCredit.freecourseavailable > 0) {
                        return res.status(200).json({
                            finalprice: 0,
                            promocodetype: "creditcode",
                            message: "Credit Code is Validated"
                        });
                    } else {
                        return res.status(400).json({
                            message: "Insufficient Credit to get Free Cohort"
                        });
                    }
                } else {
                    return res.status(400).json({
                        message: "This credit code is not belongs to you"
                    });
                }
            }

            const findActiveBanner = await Banner.findOne({ isrunning: true });

            if (findActiveBanner) {
                if (findActiveBanner.bannercode.toLowerCase() === req.body.promocode.toLowerCase() && (Date.parse(findActiveBanner?.startdate + " 00:00:00")) < Date.now() && (Date.parse(findActiveBanner?.enddate + " 00:00:00")) > Date.now()) {
                    return res.status(200).json({
                        finalprice: req.body.price - (req.body.price * findActiveBanner.discount / 100),
                        promocodetype: "offercode",
                        message: "Promo Code is Validated"
                    });
                }
            }

            return res.status(400).json({ message: "Invalid code" });

        } catch (e) {
            console.log(e);
            return res.status(500).send({ message: "Promocode Apply Failed" });
        }
    }
}