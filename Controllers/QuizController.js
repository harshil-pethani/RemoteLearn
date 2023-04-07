import Quiz from "../Models/Quiz.js";

export const QuizCreate = {
    validator: async (req, res, next) => {
        if (!req.body.answers || !req.body.name || !req.body.email || !req.body.phone) {
            return res.status(400).send("Please Fill all the Fields");
        }
        next();
    },
    controller: async (req, res) => {
        try {
            const newQuizSubmit = await Quiz.create({
                quizanswers: req.body.answers,
                username: req.body.name,
                email: req.body.email,
                phone: req.body.phone
            })
            return res.status(201).send("Quiz Answer Submitted");
        } catch (e) {
            console.log(e);
            return res.status(500).send("Quiz Answer Submition failed");
        }
    }
}

export const getSingleQuizData = {
    validator: async (req, res, next) => {
        if (!req.params.id) {
            return res.status(400).send("Invalid Quiz Data");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const findQuizData = await Quiz.findById(req.params.id);

                if (!findQuizData) {
                    return res.status(400).send("Quiz Data Not Found")
                }

                return res.status(200).send(findQuizData);

            } catch (e) {
                console.log(e);
                return res.status(500).send("Quiz Data Fetching Failed");
            }
        } else {
            return res.status(400).send("You can't see Consulting student details")
        }
    }
}

export const getAllQuizes = {
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                const findQuiz = await Quiz.find();

                if (findQuiz.length == 0) {
                    return res.status(400).send("Quiz Submitted Data Not Found")
                }

                return res.status(200).send(findQuiz);

            } catch (e) {
                console.log(e);
                return res.status(500).send("Quiz Submitted Data fetching Failed");
            }
        } else {
            return res.status(400).send("You can't see the Cunsulting students details")
        }
    }
}

export const deleteSingleQuizData = {
    validator: async (req, res, next) => {
        if (!req.params.id) {
            return res.status(400).send("Invalid Quiz Data id");
        }
        next();
    },
    controller: async (req, res) => {
        if (req.currUser.usertype === "owner") {
            try {
                await Quiz.findByIdAndDelete(req.params.id);

                return res.status(200).send("Quiz Data Deleted Successful");
            } catch (e) {
                console.log(e);
                return res.status(500).send("Quiz Data Delete failed");
            }
        } else {
            return res.status(400).send("You can't delete consulting student details")
        }
    }
}