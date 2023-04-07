import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { quizContext } from '../App';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { quizSubmitApi } from '../Config/Api';

const Quiz = ({ quizStarted, setQuizStarted }) => {
    const [queNum, setQueNum] = useState(0);
    const [curChecks, setCurChecks] = useState([]);
    const [curQuestion, setCurQuestion] = useState("");
    const [curAns, setCurAns] = useState("");
    const [curId, setCurId] = useState("");
    const [totalQues, setTotalQues] = useState(8);

    const [submitAnsPopupActive, setSubmitAnsPopupActive] = useState(false);
    const [ansSubmitted, setAnsSubmitted] = useState(false);
    const [quizData, setQuizData] = useState({ name: "", email: "", phone: "" });
    const [errMsg, setErrMsg] = useState("");

    const [isReqProcessing, setIsReqProcessing] = useState(false);

    const { setQuizCompleted, quizCompleted, setQuizAnswers } = useContext(quizContext);

    const navigate = useNavigate();

    const quizQuestions = [
        {
            id: "que1",
            que: "Your friends would describe you as...",
            checks: ["Skeptical", "Empathetic", "a Storyteller", "a Problem Solver", "a Leader"]
        },
        {
            id: "que2",
            que: "What’s your favorite type of project ?",
            checks: ["Making a diorama/art project", "Writing a research paper", "Preparing or giving a presentation", "Automating workflows / making something work", "Planning a new program initiative or organizing a discussion group"]
        },
        {
            id: "que3",
            que: "How do you make important decisions ?",
            checks: ["After carefully analyzing every option and the predicted results", "After checking with friends", "I make an executive decision and everyone follows along", "Create a poll and ask social media", "Gut instinct", "Come up with the simplest possible solution"]
        },
        {
            id: "que4",
            que: "What does success mean for you?",
            checks: ["Earning a high income", "Autonomy to make high-level decisions", "Ability to balance work and life", "Creative control of my projects"]
        },
        {
            id: "que5",
            que: "When you picture your ideal job, what are you doing?",
            checks: ["Working in a fast-paced role that pushes me to produce results", "Getting creative and coming up with new ideas", "Thinking big-picture and solving problems", "Figuring out how the company operates, and finding ways to do it better", "Leading a team"]
        },
        {
            id: "que6",
            que: "How do you feel about working in groups?",
            checks: ["I love working in groups!", "I like working with a group, as long as I can take the lead", "I can adapt to any situation", "I prefer to work by myself most of the time"]
        },
        {
            id: "que7",
            que: "Do you consider yourself an introvert or extrovert?",
            checks: ["Extrovert all the way", "Mostly extroverted", "A balance between both", "Mostly introverted", "Introvert all the way"]
        },
        {
            id: "que8",
            que: "Which of these is your strongest skill?",
            checks: ["Storytelling", "Logical Thinking", "Creativity", "Troubleshooting", "Persuasive Communication", "Math & Statistics"]
        },
    ]

    const [answers, setAnswers] = useState({});

    const startQuiz = () => {
        setCurQuestion(quizQuestions[0].que);
        setQueNum(1);
        setCurChecks(quizQuestions[0].checks);
        setCurId(quizQuestions[0].id);
        setQuizStarted(true);
        setTotalQues(8);
    }

    const nextQuestion = () => {
        if (!curAns)
            return;
        setAnswers({ [`que${queNum}`]: { "que": curQuestion, "ans": curAns, "options": curChecks }, ...answers });
        setCurAns("");
        if (answers[`que${queNum + 1}`]) {
            setCurAns(answers[`que${queNum + 1}`].ans);
        }
        setCurQuestion(quizQuestions[queNum].que);
        setCurChecks(quizQuestions[queNum].checks);
        setCurId(quizQuestions[queNum].id);
        setQueNum(queNum + 1);
    }

    const prevQuestion = () => {
        setCurAns(answers[`que${queNum - 1}`].ans);
        setCurQuestion(quizQuestions[queNum - 2].que);
        setCurChecks(quizQuestions[queNum - 2].checks);
        setQueNum(queNum - 1);
    }

    const submitQuiz = () => {
        if (!curAns)
            return;
        setAnswers({ [`que${queNum}`]: { "que": curQuestion, "ans": curAns, "options": curChecks }, ...answers })
        setQuizCompleted(true);
        setQuizAnswers({ ...answers });
        setSubmitAnsPopupActive(true);
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if (!quizData.name || !quizData.email || !quizData.phone) {
            setErrMsg("Please fill out all the fields")
            return;
        } else if (quizData.name.length < 3) {
            setErrMsg("Please Enter Valid Username");
            return false;
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(quizData.email))) {
            setErrMsg("Please Enter Valid Email Address");
            return false;
        } else if (!(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(quizData.phone))) {
            setErrMsg("Please Enter Valid Mobile Number");
            return false;
        }

        try {
            setIsReqProcessing(true);
            const res = await axios.post(quizSubmitApi, { answers: answers, ...quizData });
            if (res.status === 201) {
                setIsReqProcessing(false);
                setAnsSubmitted(true);
            }
        } catch (e) {
            setIsReqProcessing(false);
            if (e.response.status === 400) {
                setErrMsg(e.response.data);
            } else if (e.response.status === 500) {
                setErrMsg(e.response.data);
            } else {
                setErrMsg("Sorry, Something went wrong - Please try after some time.");
            }
        }
    }

    return (
        <div className="quiz" id="quizComponent">
            {
                submitAnsPopupActive &&
                (
                    <div className="popUpLayer">
                        {
                            !ansSubmitted ?
                                <div className="popUpBox">
                                    <h2 className="popuptitle">
                                        How can we get in Touch ?
                                    </h2>
                                    <p className="popupsubtitle">
                                        Tell us little bit more about you!
                                    </p>
                                    <form action="">
                                        <label htmlFor="name">
                                            Name<span>*</span>
                                        </label>
                                        <input value={quizData.name} id="name" onChange={(e) => setQuizData({ ...quizData, name: e.target.value })} type="text" />

                                        <label htmlFor="email">
                                            Email<span>*</span>
                                        </label>
                                        <input value={quizData.email} id="email" onChange={(e) => setQuizData({ ...quizData, email: e.target.value.toLowerCase() })} type="email" />

                                        <label htmlFor="phone">
                                            Phone<span>*</span>
                                        </label>
                                        <input value={quizData.phone} id="phone" onChange={(e) => setQuizData({ ...quizData, phone: e.target.value })} type="text" />

                                        <p className="msg">
                                            You will receive e-mails & texts messages from Remote Learn at phone number and email address provided in this form.
                                        </p>

                                        <p className="errMsg">
                                            {errMsg}
                                        </p>

                                        <button onClick={submitForm} type="submit">
                                            Submit
                                        </button>
                                    </form>
                                </div>
                                :
                                <div className="popUpBox">
                                    <h2 className="popuptitle">
                                        YOR’RE ALL SET
                                    </h2>
                                    <p className="popupsubtitle">
                                        You will receive e-mails & texts messages from Remote Learn at phone number and email address provided in this form. Till than Explore our Courses.
                                    </p>
                                    <button onClick={
                                        () => {
                                            setSubmitAnsPopupActive(false);
                                            navigate("/")
                                        }
                                    }>
                                        Continue Exploring
                                    </button>
                                </div>
                        }
                    </div>
                )
            }
            {
                (queNum === 0)
                &&
                <>
                    <h2 className="title">
                        Take the Simple Quiz
                    </h2>
                    <h3 className="slogan">
                        Find out which Domain is right for you <br /> (If you are confused)
                    </h3>
                    <button onClick={startQuiz} className="btn learnmore">
                        Get Started <ion-icon name="arrow-forward"></ion-icon>
                    </button>
                </>
            }

            <div className={quizStarted ? "activeQueBox questionBox" : "questionBox"}>
                {
                    curQuestion &&
                    <>
                        <h2 className="question">
                            {queNum}. {curQuestion}
                        </h2>
                        <div className="checks">
                            {
                                curChecks &&
                                curChecks.map((curCheck, index) => {
                                    return (
                                        <div key={"radio" + index}>
                                            <input type="radio" checked={curAns === curCheck || answers[`que${queNum}`] === curCheck} onChange={(e) => setCurAns(e.target.value)} name={curId} id={curId + index} value={curCheck} />
                                            <label htmlFor={curId + index} className="box"></label>
                                            <label className='text' htmlFor={curId + index}>{curCheck}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {
                            (queNum === totalQues)
                                ?
                                <button onClick={submitQuiz} className="btn">
                                    Submit
                                </button>
                                :
                                <button onClick={nextQuestion} className="btn">
                                    Next <ion-icon name="arrow-forward"></ion-icon>
                                </button>
                        }
                    </>
                }
            </div>

            {
                (queNum > 0) &&
                <div className="preNextBtns">
                    <button onClick={prevQuestion} disabled={queNum === 1} className="pre">
                        <ion-icon name="chevron-back-outline"></ion-icon>
                    </button>
                    <button onClick={nextQuestion} disabled={queNum === totalQues || !curAns} className="next">
                        <ion-icon name="chevron-forward-outline"></ion-icon>
                    </button>
                </div>
            }
        </div>
    )
}

export default Quiz