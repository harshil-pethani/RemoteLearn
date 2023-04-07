import sendSlotMail from "../Mails/SendSlotMail.js";
import Course from "../Models/Course.js";
import Notify from "../Models/Notify.js";
import Batch from "../Models/Batch.js";


// Course APIs
export const courseCreate = {
    validator: async (req, res, next) => {
        if (
            !req.body.title ||
            !req.body.description ||
            !req.body.topics ||
            !req.body.courseduration ||
            !req.body.dailytime ||
            !req.body.price ||
            !req.currUser.usertype
        ) {
            return res.status(400).send("Please Fill all the Fields");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const newCourse = await Course.create({
                    title: req.body.title,
                    description: req.body.description,
                    topics: req.body.topics,
                    courseduration: req.body.courseduration,
                    dailytime: req.body.dailytime,
                    price: req.body.price,
                    faculty: req.currUser._id,
                    status: "approved"
                })
                return res.status(201).send({
                    "message": "Cohort Creation Successful",
                    ...newCourse._doc
                });
            } catch (e) {
                console.log(e);
                return res.status(500).send("Cohort Creation Failed");
            }
        } else {
            try {
                const newCourse = await Course.create({
                    title: req.body.title,
                    description: req.body.description,
                    topics: req.body.topics,
                    courseduration: req.body.courseduration,
                    dailytime: req.body.dailytime,
                    price: req.body.price,
                    faculty: req.currUser._id,
                    status: "pending"
                })
                return res.status(201).send({
                    "message": "Cohort Creation Successful",
                    ...newCourse._doc
                });
            } catch (e) {
                console.log(e);
                return res.status(500).send("Course Creation Failed");
            }

        }
    }
}

export const getSingleCourse = {
    validator: async (req, res, next) => {
        if (!req.params.id) {
            return res.status(400).send("Invalid Course");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const findCourse = await Course.findById(req.params.id);

            if (!findCourse) {
                return res.status(400).send("Course Not Found")
            }

            let batches = [];
            if (findCourse.batches.length !== 0) {
                for (let i = 0; i < findCourse.batches.length; i++) {
                    let curBatch = await Batch.findById(findCourse.batches[i]);
                    batches.push(curBatch);
                }
            }

            return res.status(200).json({
                course: findCourse,
                batches: batches
            });

        } catch (e) {
            console.log(e);
            return res.status(500).send("Course Fetching Failed");
        }
    }
}

export const courseUpdate = {
    validator: async (req, res, next) => {
        if (
            !req.body.title ||
            !req.body.description ||
            !req.body.topics ||
            !req.body.courseduration ||
            !req.body.dailytime ||
            !req.body.price ||
            !req.currUser.usertype
        ) {
            return res.status(400).send("Please Fill all the Fields");
        } else if (!req.params.id) {
            return res.status.send("Invalid Course");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const findCourse = await Course.findById(req.params.id);

            if (!findCourse) {
                return res.status(400).send("Coures is Not found");
            }

            if (findCourse.faculty !== req.currUser._id.toString()) {
                return res.status(400).send("You can't update the course details")
            }

            const updateCourse = await Course.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                description: req.body.description,
                topics: req.body.topics,
                courseduration: req.body.courseduration,
                dailytime: req.body.dailytime,
                price: req.body.price,
                faculty: req.currUser._id,
                status: "pending"
            }, { new: true })
            return res.status(200).send({
                "message": "Course updation Successful",
                ...updateCourse._doc
            });
        } catch (e) {
            console.log(e);
            return res.status(500).send("Course updation Failed");
        }
    }
}

export const approveCourse = {
    validator: async (req, res, next) => {
        if (!req.body._id) {
            return res.status.send("Invalid Course");
        }
        next();
    },
    controller: async (req, res) => {
        console.log(req.currUser);
        if (req.currUser.usertype === "owner") {
            try {
                const findCourse = await Course.findById(req.body._id);

                if (!findCourse) {
                    return res.status(400).send("Coures is Not found");
                }

                const updateCourse = await Course.findByIdAndUpdate(req.body._id, {
                    status: "approved"
                }, { new: true })

                return res.status(200).send({
                    "message": "Course approved",
                    ...updateCourse._doc
                });
            } catch (e) {
                console.log(e);
                return res.status(500).send("Course approve Failed");
            }
        } else {
            return res.status(400).send("You can't approve the course");
        }
    }
}

export const courseDelete = {
    validator: async (req, res, next) => {
        if (!req.params.id) {
            return res.status(400).send("Invalid Course");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const findCourse = await Course.findById(req.params.id);

                if (!findCourse) {
                    return res.status(400).send("Cohort is Not found");
                }

                if (findCourse.batches.length !== 0) {
                    for (let i = 0; i < findCourse.batches.length; i++) {
                        await Batch.findByIdAndDelete(findCourse.batches[i]);
                    }
                }

                await Course.findByIdAndDelete(req.params.id)

                return res.status(200).send(
                    "Course Deleted Successfully",
                );

            } catch (e) {
                console.log(e);
                return res.status(500).send("Course Deletion Failed");
            }
        } else {
            return res.status(400).send("You can't Delete the course")
        }
    }
}

export const getAllCourses = {
    controller: async (req, res) => {
        try {
            const findCourses = await Course.find({ status: "approved" });

            if (findCourses.length == 0) {
                return res.status(200).send("Courses Not Found")
            }

            // let timeSlots = {};
            // for (let i = 0; i < findCourses.length; i++) {
            //     let stamps = findCourses[i].slots;
            //     // console.log(findCourses[i]);
            //     timeSlots[findCourses[i]._id] = [];
            //     for (let j = 0; j < stamps.length; j++) {
            //         let slotVal = await Slot.findById(stamps[i]);
            //         timeSlots[findCourses[i]._id].push(slotVal);
            //     }
            // }

            // console.log(timeSlots);

            return res.status(201).send(findCourses);

        } catch (e) {
            console.log(e);
            return res.status(500).send("Courses Fetching Failed");
        }
    }
}


export const getAllCoursesOfFaculty = {
    controller: async (req, res) => {
        try {
            let findCourses;
            if (req.currUser.usertype === "owner") {
                findCourses = await Course.find();
            } else {
                findCourses = await Course.find({ faculty: req.currUser._id });
            }

            if (findCourses.length == 0) {
                return res.status(200).send("Courses Not Found")
            }

            // let timeSlots = {};
            // for (let i = 0; i < findCourses.length; i++) {
            //     let stamps = findCourses[i].slots;
            //     // console.log(findCourses[i]);
            //     timeSlots[findCourses[i]._id] = [];
            //     for (let j = 0; j < stamps.length; j++) {
            //         let slotVal = await Slot.findById(stamps[i]);
            //         timeSlots[findCourses[i]._id].push(slotVal);
            //     }
            // }

            // console.log(timeSlots);

            return res.status(201).send(findCourses);

        } catch (e) {
            console.log(e);
            return res.status(500).send("Courses Fetching Failed");
        }
    }
}


// Batch APIs
export const batchCreate = {
    validator: async (req, res, next) => {
        if (
            !req.body.courseid ||
            !req.body.name ||
            !req.body.startdate ||
            !req.body.enddate ||
            !req.body.batchstatus ||
            !req.body.starttime ||
            !req.body.endtime
        ) {
            return res.status(400).send("Please fill all the fields");
        }
        next()
    },
    controller: async (req, res) => {
        try {
            const findCourse = await Course.findById(req.body.courseid);

            if (!findCourse) {
                return res.status(400).send("Course not found");
            }

            const newBatch = await Batch.create({
                name: req.body.name,
                startdate: req.body.startdate,
                enddate: req.body.enddate,
                batchstatus: req.body.batchstatus,
                starttime: req.body.starttime,
                endtime: req.body.endtime,
            })

            const updateCourse = await Course.findByIdAndUpdate(req.body.courseid, {
                batches: [...findCourse.batches, newBatch._id]
            })

            return res.status(201).json("Batch creating Succesfull");

        } catch (e) {
            console.log(e)
            res.status(500).send("Batch Creation Failed");
        }
    }
}

export const getSingleBatch = {
    validator: async (req, res, next) => {
        if (!req.params.id) {
            return res.status(400).send("Invalid Batch");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const findBatch = await Batch.findById(req.params.id);

            if (!findBatch) {
                return res.status(400).send("Batch Not Found")
            }

            return res.status(200).send(findBatch);

        } catch (e) {
            console.log(e);
            return res.status(500).send("Batch Fetching Failed");
        }
    }
}

export const batchUpdate = {
    validator: async (req, res, next) => {
        if (
            !req.body.name ||
            !req.body.startdate ||
            !req.body.enddate ||
            !req.body.batchstatus ||
            !req.body.starttime ||
            !req.body.endtime
        ) {
            return res.status(400).send("Please fill all the fields");
        } else if (!req.params.id) {
            return res.status(400).send("Invalid Batch");
        }
        next()
    },
    controller: async (req, res) => {
        try {
            const updateBatch = await Batch.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                startdate: req.body.startdate,
                enddate: req.body.enddate,
                batchstatus: req.body.batchstatus,
                starttime: req.body.starttime,
                endtime: req.body.endtime,
            })

            if (req.body.batchstatus === "Enroll") {
                const alerts = await Notify.find({ batchid: req.params.id });
                console.log(alerts);
                for (let i = 0; i < alerts.length; i++) {
                    try {
                        console.log("Slot is now Available to Book");
                        await sendSlotMail(alerts[i]);
                    } catch (e) {
                        console.log(e);
                        console.log("Sending Mail failed");
                    }
                }
                for (let i = 0; i < alerts.length; i++) {
                    try {
                        await Notify.findByIdAndDelete(alerts[i]._id);
                    } catch (e) {
                        console.log(e);
                        console.log("Deletion Failed");
                    }
                }
            }

            return res.status(200).json("Batch Update Succesfull");

        } catch (e) {
            console.log(e)
            res.status(500).send("Batch Updation Failed");
        }
    }
}

export const batchDelete = {
    validator: async (req, res, next) => {
        if (!req.body.courseid) {
            return res.status(400).send("Course Id not found");
        }
        else if (!req.params.id) {
            return res.status(400).send("Invalid Batch");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const findCourse = await Course.findById(req.body.courseid);

            if (!findCourse) {
                return res.status(400).send("Course is Not found");
            }

            const findBatch = await Batch.findById(req.params.id);

            if (!findBatch) {
                return res.status(400).send("Batch is Not found");
            }

            let batches = findCourse.batches;

            let updatedBatches = batches.filter((batch) => batch.toString() !== req.params.id)
            // console.log(updatedBatches);

            const updateCourse = await Course.findByIdAndUpdate(req.body.courseid, {
                batches: updatedBatches
            })

            await Batch.findByIdAndDelete(req.params.id)

            return res.status(200).send("Batch Deleted Successfully");

        } catch (e) {
            console.log(e);
            return res.status(500).send("Batch Deletion Failed");
        }
    }
}

export const getAllBatches = {
    controller: async (req, res) => {
        try {
            const findSlots = await Slot.find();

            if (findSlots.length == 0) {
                return res.status(200).send("Cohorts Not Found")
            }

            let timeSlots = {};
            for (let i = 0; i < findSlots.length; i++) {
                timeSlots[findSlots[i]._id.toString()] = findSlots[i];
            }

            return res.status(200).send(timeSlots);

        } catch (e) {
            console.log(e);
            return res.status(500).send("Cohorts Fetching Failed");
        }
    }
}