import React, { useEffect, useState } from 'react'
import share from "../Assets/share.png"
import people from "../Assets/networking.png"
import money from "../Assets/money.png"
import axios from 'axios';
import { checkReferralApi, getReferralCodeApi } from '../Config/Api';
import { useLocation } from 'react-router-dom';

const Referral = ({ setTermPopupActive }) => {
    const [referralCode, setReferralCode] = useState("");
    const [referralCodeVerified, setReferralCodeVerified] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [referralData, setReferralData] = useState({ totalReferrals: 0, remainingReferrals: 0, freecourseavailable: 0 });
    // harsgm5523
    const [isError, setIsError] = useState("");
    const [isError2, setIsError2] = useState("");
    const [resMsg, setResMsg] = useState("");
    const [resMsg2, setResMsg2] = useState("");
    const [isReqProcessing, setIsReqProcessing] = useState(false);

    const [mainDomain, setMainDomain] = useState("");

    const validateData = () => {
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail))) {
            setIsError(true);
            setResMsg("Please enter valid email address");
            return false;
        }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const location = useLocation();

    useEffect(() => {
        setMainDomain(location.pathname.split("/")[0]);
    }, [location]);


    const getReferralCode = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                setIsReqProcessing(true);
                const res = await axios.post(getReferralCodeApi, {
                    email: userEmail
                })
                if (res.status === 200) {
                    setIsReqProcessing(false);
                    setResMsg(res.data);
                    setIsError(false);
                }
            } catch (e) {
                // console.log(e);
                setIsError(true);
                setIsReqProcessing(false);
                if (e.response.status === 400) {
                    setResMsg(e.response.data);
                } else if (e.response.status === 500) {
                    setResMsg(e.response.data);
                } else {
                    setResMsg("Sorry, Something went wrong - Please try after some time.");
                }
            }
        }
    }

    const checkReferral = async (e) => {
        e.preventDefault();
        try {
            setIsReqProcessing(true);
            const res = await axios.post(checkReferralApi, {
                referralcode: referralCode.toLowerCase()
            })
            if (res.status === 200) {
                setIsReqProcessing(false);
                setResMsg2("Referral code validated");
                setIsError2(false);
                setReferralCodeVerified(true);
                setReferralData({ totalReferrals: res?.data?.totalreferrals, freecourseavailable: res?.data?.freecourseavailable, remainingReferrals: 5 - res?.data?.newreferrals });
            }
        } catch (e) {
            // console.log(e);
            setIsError2(true);
            setReferralCodeVerified(false);
            setIsReqProcessing(false);
            if (e.response.status === 400) {
                setResMsg2(e.response.data);
            } else if (e.response.status === 500) {
                setResMsg2(e.response.data);
            } else {
                setResMsg2("Sorry, Something went wrong - Please try after some time.");
            }
        }
    }

    // console.log(referralData)

    return (
        <>
            <div className="referralDetails">
                <h1 className="title">
                    Remote Learn Referral Program
                </h1>
                <p className="desc">
                    Introduce your friends to Remote Learn to unlock rewards. When 5 friends Enroll any course for the first time, you’ll get one Remote Learn Coin (One Remote Learn Coin is equivalent to one free course) <span onClick={() => setTermPopupActive(true)}>Terms apply</span>
                </p>
                <div className="details">
                    <div className="detailBox">
                        <img loading="lazy" src={share} alt="" />
                        <p className="detailDesc">
                            Share you code with friends and family
                        </p>
                    </div>
                    <div className="detailBox">
                        <img loading="lazy" src={people} alt="" />
                        <p className="detailDesc">
                            5 People Enroll Course from  Remote Learn
                        </p>
                    </div>
                    <div className="detailBox">
                        <img loading="lazy" src={money} alt="" />
                        <p className="detailDesc">
                            You receive One Remote Learn Coin
                        </p>
                    </div>
                </div>

                <form>
                    <label htmlFor="email">Enter Email Address to Receive a Unique Code</label>
                    <div className="formField">
                        <input value={userEmail} onChange={(e) => setUserEmail(e.target.value.toLowerCase())} type="email" id='email' placeholder="Enter Email Address" />
                        <button disabled={isReqProcessing} onClick={getReferralCode}>
                            Send
                        </button>
                    </div>

                    <p className={isError ? "resMsg error" : "resMsg"}>
                        {resMsg}
                    </p>
                </form>
            </div>
            <div className="referralStatus">
                <div className="left">
                    <form>
                        <label htmlFor="referralCode">
                            Check Your Referral Status
                        </label>
                        <div className="formField">
                            <input autoComplete="off" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} type="text" id='referralCode' placeholder="Enter Your Referral Code" />
                            <button disabled={isReqProcessing} onClick={checkReferral}>
                                Check
                            </button>
                        </div>

                        <p className={isError2 ? "resMsg error" : "resMsg"}>
                            {resMsg2}
                        </p>

                    </form>
                    <div className="shortLinks">
                        <a className={referralCodeVerified ? undefined : "disabled"} target="_blank" rel="noreferrer" href={`https://api.whatsapp.com/send/?text=${encodeURIComponent("Here's my Remote Learn referral code: ")} *${referralCode}* ${encodeURIComponent(" You can redeem the code at checkout. ")} ${mainDomain}`}>
                            <ion-icon name="logo-whatsapp"></ion-icon>
                        </a>
                        <a className={referralCodeVerified ? undefined : "disabled"} target="_blank" rel="noreferrer" href={`https://twitter.com/share?&url=${mainDomain}&text=${encodeURIComponent("Here's my Remote Learn referral code: ")} ${referralCode} ${encodeURIComponent(" You can redeem the code at checkout.")}`}>
                            <ion-icon name="logo-twitter"></ion-icon>
                        </a>
                        <a className={referralCodeVerified ? undefined : "disabled"} target="_blank" rel="noreferrer" href={`mailto:?body=${encodeURIComponent("Here's my Remote Learn referral code: ")} ${referralCode} ${encodeURIComponent(" You can redeem the code at checkout. ")} ${mainDomain}&subject=${encodeURIComponent("Checkout Remote Learn")}`}>
                            <ion-icon name="mail"></ion-icon>
                        </a>
                    </div>
                </div>
                <div className="right">
                    <div className="item">
                        <p className="itemValue">
                            {referralData.totalReferrals}
                        </p>
                        <p className="itemTitle">
                            Successful referrals
                        </p>
                    </div>
                    <div className="item">
                        <p className="itemValue">
                            {referralData.remainingReferrals}
                        </p>
                        <p className="itemTitle">
                            More referrals to
                            unlock the reward
                        </p>
                    </div>
                    <div className="item">
                        <p className="itemValue">
                            {referralData.freecourseavailable}
                        </p>
                        <p className="itemTitle">
                            Remote Learn Coins  available
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Referral