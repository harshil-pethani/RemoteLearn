import Glance from "../Models/Glance.js";
import User from "../Models/User.js";
import Course from "../Models/Course.js";
import Order from "../Models/Order.js";

export const glanceCreate = {
    validator: async (req, res, next) => {
        // console.log(req.body);
        if (!req.body.teachers || !req.body.trainedstudents || !req.body.placedstudents) {
            return res.status(400).send("Please Fill all the Fields");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const findDetail = await Glance.find();

                for (let i = 0; i < findDetail.length; i++) {
                    await Glance.findByIdAndDelete(findDetail[i]._id)
                }

                const createDetail = await Glance.create({
                    teachers: req.body.teachers,
                    trainedstudents: req.body.trainedstudents,
                    placedstudents: req.body.placedstudents,
                })

                console.log(createDetail);
                return res.status(201).send("Glance Created");
            } catch (e) {
                console.log(e);
                return res.status(500).send("Glance Creation Failed");
            }
        } else {
            return res.status(400).send("You can't create the Glance details")
        }
    }
}

export const glanceUpdate = {
    validator: async (req, res, next) => {
        if (!req.body.teachers || !req.body.trainedstudents || !req.body.placedstudents) {
            return res.status(400).send("Please Fill all the Fields");
        } else if (!req.params.id) {
            return res.status(400).send("Invalid Detail");
        }
        next();
    },
    controller: async (req, res) => {

        if (req.currUser.usertype === "owner") {
            try {
                const updateDetail = await Glance.findByIdAndUpdate(req.params.id, {
                    teachers: req.body.teachers,
                    trainedstudents: req.body.trainedstudents,
                    placedstudents: req.body.placedstudents,
                })

                // console.log(updateDetail);
                return res.status(200).send("Glance Updated");
            } catch (e) {
                // console.log(e);
                return res.status(500).send("Glance Updation Failed");
            }
        } else {
            return res.status(400).send("You can't update the Glance details")
        }
    }
}

export const glanceGet = async (req, res) => {
    try {
        const getDetail = await Glance.findOne();


        let teachers = await User.find({ usertype: "faculty" }).count();
        let courses = await Course.find().count();
        let students = await Order.find().count();
        return res.status(200).send({ teachers, courses, students });

    } catch (e) {
        console.log(e);
        return res.status(500).send("Detail Getting Failed ")
    }
}
