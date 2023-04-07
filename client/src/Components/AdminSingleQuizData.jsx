import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSingleQuizDataApi, sendBulkMailApi } from '../Config/Api';
import AdminSide from './AdminSide'
import AdminTop from './AdminTop'
import Loader from './Loader';

const AdminSingleQuizData = ({ adminDetails, setAdminLogged }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [userDetails, setUserDetails] = useState({ username: "", email: "", phone: "" })
    const [quizAnswers, setQuizAnswers] = useState({});
    const [queKeyArray, setQueKeyArray] = useState([]);
    const [quizDataId, setQuizDataId] = useState();



    const [emailData, setEmailData] = useState("");
    const [mailContent, setMailContent] = useState("");
    const [mailSubject, setMailSubject] = useState("");
    const [mailTitle, setMailTitle] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const [sendMailPopupActive, setSendMailPopupActive] = useState(false);
    const [mailSentSuccess, setMailSentSuccess] = useState(false);
    const [isReqProcessing, setIsReqProcessing] = useState(false);

    useEffect(() => {
        setQuizDataId(location.pathname.split("/")[3]);
    }, [location]);

    useEffect(() => {
        const getQuizList = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(getSingleQuizDataApi(quizDataId), { withCredentials: true });
                if (res.status === 200) {
                    setIsLoading(false);
                    setQuizAnswers({ ...res.data.quizanswers })
                    setUserDetails({ username: res.data.username, email: res.data.email, phone: res.data.phone })
                    setEmailData(res.data.email);
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        }
        if (quizDataId)
            getQuizList();
    }, [quizDataId]);

    useEffect(() => {
        setQueKeyArray(Object.keys(quizAnswers).reverse())
    }, [quizAnswers]);


    const sendMail = async (e) => {
        e.preventDefault();

        if (!emailData || !mailContent || !mailTitle || !mailSubject) {
            setErrMsg("Please fill out all the fields")
            return;
        } else if (mailContent.length < 10) {
            setErrMsg("Mail Content should be more than 10 characters.");
            return false;
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailData))) {
            setErrMsg("Please Enter Valid Email Address");
            return false;
        }
        setErrMsg("");


        try {
            setIsReqProcessing(true);
            const res = await axios.post(sendBulkMailApi, { emailData: emailData, mailContent: mailContent, mailSubject: mailSubject, mailTitle: mailTitle }, { withCredentials: true });
            if (res.status === 200) {
                setIsReqProcessing(false);
                setMailSentSuccess(true);
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
        <div>
            {
                sendMailPopupActive &&
                (
                    <div className="mailPopUpLayer">
                        {
                            !mailSentSuccess ?
                                <div className="popUpBox">
                                    <ion-icon onClick={() => setSendMailPopupActive(false)} name="close-circle-outline"></ion-icon>
                                    <form>
                                        <h2 className="popuptitle">
                                            Enter Mail Details
                                        </h2>
                                        <label htmlFor="email">
                                            Email Address of Student<span>*</span>
                                        </label>
                                        <input value={emailData} id="email" onChange={(e) => setEmailData(e.target.value)} type="email" />

                                        <label htmlFor="mailTitle">
                                            Mail Title<span>*</span>
                                        </label>
                                        <input value={mailTitle} id="mailTitle" onChange={(e) => setMailTitle(e.target.value)} type="text" />

                                        <label htmlFor="mailSubject">
                                            Mail Subject<span>*</span>
                                        </label>
                                        <input value={mailSubject} id="mailSubject" onChange={(e) => setMailSubject(e.target.value)} type="text" />

                                        <label htmlFor="mailContent">
                                            Mail Content<span>*</span>
                                        </label>
                                        <textarea value={mailContent} id="mailContent" onChange={(e) => setMailContent(e.target.value)} type="text" />

                                        <p className="errMsg">
                                            {errMsg}
                                        </p>
                                        <button disabled={isReqProcessing} onClick={sendMail} type="submit">
                                            Send
                                        </button>
                                    </form>
                                </div>
                                :
                                <div className="mailSentPopUpBox popUpBox">
                                    <h2 className="popuptitle">
                                        YOR’RE ALL SET
                                    </h2>
                                    <p className="popupsubtitle">
                                        Email has been sent to all the Students, which you have mentioned.
                                    </p>
                                    <button onClick={
                                        () => {
                                            setSendMailPopupActive(false);
                                            navigate("/admin/students")
                                        }
                                    }>
                                        Continue Exploring
                                    </button>
                                </div>
                        }
                    </div>
                )
            }
            <AdminTop adminDetails={adminDetails} />
            <div className="adminMainContent">

                <AdminSide adminDetails={adminDetails} setAdminLogged={setAdminLogged} />
                {
                    isLoading ?
                        <Loader adminLoader={true} /> :
                        <div className="adminSingleQuiz right">
                            <div>
                                <div className="titleBar">

                                    <h2 className="title">
                                        User Details
                                    </h2>
                                    <button className="exportBtn" onClick={() => setSendMailPopupActive(true)}>
                                        Send Email
                                    </button>
                                </div>
                                <form className='form'>
                                    <div className="fields">
                                        <div className="formField">
                                            <div className="dateBox">
                                                <div className="subFormField">
                                                    <label className="fieldTitle" htmlFor="username">
                                                        Student Name<span>*</span>
                                                    </label>
                                                    <input readOnly id="username" value={userDetails?.username} type="text" />
                                                </div>
                                                <div className="subFormField">
                                                    <label className="fieldTitle" htmlFor="email">
                                                        Student Email<span>*</span>
                                                    </label>
                                                    <input readOnly id="email" value={userDetails?.email} type="text" />
                                                </div>
                                                <div className="subFormField">
                                                    <label className="fieldTitle" htmlFor="phone">
                                                        Student Phone<span>*</span>
                                                    </label>
                                                    <input readOnly id="phone" value={userDetails?.phone} type="text" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div>
                                <h2 className="title">
                                    User's Quiz Answers
                                </h2>

                                <div className="quizContainer">
                                    {
                                        queKeyArray.map((curQuizAnswer, index) =>
                                            <div className="questionBox" key={index}>
                                                <h2 className="question">
                                                    {index + 1}. {quizAnswers[curQuizAnswer]?.que}
                                                </h2>
                                                <div className="checks">
                                                    {
                                                        quizAnswers[curQuizAnswer]?.options.map((curCheck, index) => {
                                                            return (
                                                                <div key={"radio" + index}>
                                                                    <input readOnly type="radio" checked={curCheck.toString() == quizAnswers[curQuizAnswer].ans.toString()} value={curCheck} />
                                                                    <label className="box"></label>
                                                                    <label className='text'>{curCheck}</label>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                }
            </div>
        </div >
    )
}

export default AdminSingleQuizData