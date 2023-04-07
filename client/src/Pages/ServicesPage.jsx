import React, { useContext, useEffect, useState } from 'react';
import FAQ from '../Components/FAQ';
import Navbar from '../Components/Navbar';
import Quiz from '../Components/Quiz';
import Footer from '../Components/Footer';
import { planContext, quizContext } from '../App';
import AllPlansService from '../Components/AllPlansService';
import { useNavigate } from 'react-router-dom';
import { createNotificationAlertApi } from '../Config/Api';
import axios from 'axios';

const ServicesPage = () => {
    const [quizStarted, setQuizStarted] = useState(false);
    const { setQuizCompleted } = useContext(quizContext);

    const { userSelectedCourse, userSelectedBatch } = useContext(planContext);

    const navigate = useNavigate();

    const [courseConfirmPopupActive, setCourseConfirmPopupActive] = useState(false);
    const [notifyMePopupActive, setNotifyMePopupActive] = useState(false);
    const [notificationOn, setNotificationOn] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setQuizCompleted(false);
    }, []);

    const submitEmail = (e) => {
        e.preventDefault();
        setNotificationOn(true);
    }

    const handleNotifyMe = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post(createNotificationAlertApi, {
                courseid: userSelectedCourse._id,
                coursename: userSelectedCourse.title,
                batchname: userSelectedBatch.name,
                batchid: userSelectedBatch._id,
                useremail: userEmail.toLowerCase()
            })
            if (res.status === 201) {
                setIsLoading(false);
                setNotificationOn(true);
                // console.log(res);
            }
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
    }


    const [showScroll, setShowScroll] = useState(false);

    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 20) {
            setShowScroll(true)
        } else if (showScroll && window.pageYOffset <= 20) {
            setShowScroll(false)
        }
    };

    window.addEventListener('scroll', checkScrollTop)




    return (
        <div className="servicesPage" style={{ position: "relative" }}>
            <Navbar scrolled={showScroll} />
            {
                notifyMePopupActive &&
                (
                    <div className="popUpLayer">
                        {
                            !notificationOn ?
                                <div className="popUpBox">
                                    <ion-icon onClick={() => setNotifyMePopupActive(false)} name="close-circle-outline"></ion-icon>

                                    <h2 className="popuptitle">
                                        Notify me
                                    </h2>
                                    <p className="popupsubtitle">
                                        KEEP ME POSTED
                                    </p>
                                    <p className="popupsubtitle">
                                        If this Batch admission will start than
                                        we will inform you.
                                    </p>
                                    <form action="">
                                        <label htmlFor="email">
                                            Email<span>*</span>
                                        </label>
                                        <input value={userEmail} id="email" onChange={(e) => setUserEmail(e.target.value.toLowerCase())} type="email" />

                                        <p className="errMsg">
                                            {errMsg}
                                        </p>

                                        <button disabled={isLoading} onClick={handleNotifyMe} type="submit">
                                            Notify Me
                                        </button>
                                    </form>
                                </div>
                                :
                                <div className="popUpBox">
                                    <h2 className="popuptitle">
                                        Notify Me
                                    </h2>
                                    <p className="popupsubtitle">
                                        YOR’RE ALL SET
                                    </p>
                                    <p className="popupsubtitle">
                                        If Batch Admissions starts, we’ll email you at {userEmail}
                                    </p>
                                    <button onClick={
                                        () => {
                                            setNotifyMePopupActive(false);
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
                courseConfirmPopupActive &&
                (
                    <div className="popUpLayer">
                        {
                            <div className="popUpBox">
                                <ion-icon onClick={() => setCourseConfirmPopupActive(false)} name="close-circle-outline"></ion-icon>

                                <h2 className="popuptitle">
                                    {userSelectedCourse.title}
                                </h2>
                                <p className="popupsubtitle key">
                                    Batch
                                </p>
                                <p className="popupsubtitle value">
                                    {userSelectedBatch.name}
                                </p>
                                <p className="popupsubtitle key">
                                    Price
                                </p>
                                <p className="popupsubtitle value">
                                    {userSelectedCourse.price} /- Rupees
                                </p>
                                <p className="popupsubtitle">
                                    Are you sure want to purchase this course ?
                                </p>
                                <div className="popUpBtns">
                                    <button onClick={() => {
                                        setCourseConfirmPopupActive(false);
                                        navigate("/services/userdetails");
                                    }}>
                                        Yes
                                    </button>
                                    <button className="no" onClick={() => setCourseConfirmPopupActive(false)} type="submit">
                                        No
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                )
            }
            <Quiz quizStarted={quizStarted} setQuizStarted={setQuizStarted} />
            {
                !quizStarted &&
                <AllPlansService setCourseConfirmPopupActive={setCourseConfirmPopupActive} setNotifyMePopupActive={setNotifyMePopupActive} />
            }
            {
                !quizStarted &&
                <FAQ />
            }
            <Footer />
        </div>
    )
}

export default ServicesPage