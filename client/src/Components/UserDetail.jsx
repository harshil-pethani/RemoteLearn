import axios from 'axios';
import React, { useContext, useState } from 'react'
import { planContext } from '../App';
import { checkoutApi, getFinalPriceApi, purchaseCohortZeroApi } from '../Config/Api';
import { getDate } from '../Data';
import { useNavigate } from 'react-router-dom';

const UserDetail = () => {
    const [userDetails, setUserDetails] = useState({ name: "", email: "", phone: "", promocode: "" });

    const { userSelectedCourse, userSelectedBatch } = useContext(planContext);
    const [finalPrice, setFinalPrice] = useState(userSelectedCourse?.price);
    const [finalPromocode, setfinalPromocode] = useState("");

    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");
    const [isReqProcessing, setIsReqProcessing] = useState(false);
    const [codeType, setCodeType] = useState("");

    const navigate = useNavigate();

    const verifyCode = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                setIsReqProcessing(true);
                const res = await axios.post(getFinalPriceApi, {
                    promocode: userDetails.promocode.toLowerCase(),
                    email: userDetails.email.toLowerCase(),
                    price: userSelectedCourse.price
                })

                if (res.status === 200) {
                    setIsReqProcessing(false);
                    setIsError(false);
                    setResMsg(res.data.message);
                    setFinalPrice(res.data.finalprice);
                    setfinalPromocode(userDetails.promocode.toLowerCase());
                    setCodeType(res.data.promocodetype);
                }
            } catch (err) {
                setIsReqProcessing(false);
                setIsError(true);
                setfinalPromocode("");
                setCodeType("");
                console.log(err);
                if (err.response.status === 400) {
                    setResMsg(err.response.data.message);
                } else if (err.response.status === 500) {
                    setResMsg(err.response.data.message);
                } else {
                    setResMsg("Sorry, Something went wrong - Please try after some time.");
                }
            }
        }
    }

    const validateData = () => {
        if (!userDetails.name || !userDetails.email || !userDetails.phone) {
            setIsError(true);
            setResMsg("Please fill out all the fields ");
            return false;
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userDetails.email))) {
            setIsError(true);
            setResMsg("Please enter valid email address");
            return false;
        } else if (!(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/.test(userDetails.phone))) {
            setIsError(true);
            setResMsg("Please Enter Valid Mobile Number");
            return false;
        } else if (userDetails.name.length < 3) {
            setIsError(true);
            setResMsg("Please enter valid username");
            return false;
        }
        // else if (!(/^\d{10}$/.test(userDetails.phone))) {
        //     setIsError(true);
        //     setResMsg("Please Enter Valid Mobile Number");
        //     return false;
        // }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const handleCheckout = async () => {
        if (validateData()) {
            if (finalPrice > 0) {
                try {
                    setIsReqProcessing(true);
                    const res = await axios.post(checkoutApi, {
                        userSelectedCourse, userSelectedBatch, finalPrice,
                        username: userDetails.name,
                        email: userDetails.email.toLowerCase(),
                        discount: userSelectedCourse.price - finalPrice,
                        promocode: finalPromocode.toLowerCase(),
                        promocodetype: codeType
                    })
                    if (res.data.url) {
                        // setIsReqProcessing(false);
                        window.location.href = res.data.url;
                    }
                } catch (e) {
                    // console.log(e)
                    setIsReqProcessing(false);
                    setIsError(true);
                    setResMsg("Sorry, Something went wrong - Please try after some time.");

                }
            } else if (finalPrice === 0) {
                try {
                    setIsReqProcessing(true);
                    const res = await axios.post(purchaseCohortZeroApi, {
                        userSelectedCourse, userSelectedBatch, finalPrice,
                        username: userDetails.name,
                        email: userDetails.email.toLowerCase(),
                        discount: userSelectedCourse.price - finalPrice,
                        promocode: userDetails.promocode.toLowerCase(),
                        promocodetype: codeType
                    })
                    if (res.status === 200) {
                        setIsReqProcessing(false);
                        setIsError(false);
                        // console.log(res);
                        navigate(res.data);
                        // alert("Purchase Successs");
                    }
                } catch (err) {
                    setIsReqProcessing(false);
                    setIsError(true);
                    console.log(err);
                    if (err.response.status === 400) {
                        setResMsg(err.response.data);
                    } else if (err.response.status === 500) {
                        setResMsg(err.response.data);
                    } else {
                        setResMsg("Sorry, Something went wrong - Please try after some time.");
                    }
                }
            }
        }
    }

    return (
        <div className="userDetail">
            <div className="container">
                <div className="userDetailLeft">
                    <h2 className="userDetailTitle">
                        Complete registration for course
                    </h2>
                    <form action="">
                        <label htmlFor="name">Name</label>
                        <div className="formField">
                            <ion-icon name="person-outline"></ion-icon>
                            <input name="name" value={userDetails.name} onChange={(e) => {
                                setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
                            }} type="text" autoComplete="off" id="name" />
                        </div>
                        <label htmlFor="email">Email</label>
                        <div className="formField">
                            <ion-icon name="mail-outline"></ion-icon>
                            <input name="email" autoComplete="off" value={userDetails.email} onChange={(e) => {
                                setUserDetails({ ...userDetails, [e.target.name]: e.target.value.toLowerCase() });
                            }} type="email" id="email" />
                        </div>
                        <label htmlFor="phone">Phone Number</label>
                        <div className="formField">
                            <ion-icon name="call-outline"></ion-icon>
                            <input name="phone" autoComplete="off" value={userDetails.phone} onChange={(e) => {
                                setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
                            }} type="text" id="phone" />
                        </div>
                        <label htmlFor="promocode">
                            Promo Code / Referral Code
                        </label>
                        <div className="promoField formField">
                            <ion-icon name="ticket-outline"></ion-icon>
                            <input autoComplete="off" name="promocode" value={userDetails.promocode} placeholder="E.g SS2023" onChange={(e) => {
                                setUserDetails({ ...userDetails, [e.target.name]: e.target.value.toUpperCase() });
                            }} type="text" id="promocode" />
                            <button disabled={isReqProcessing} onClick={verifyCode}>Verify</button>
                        </div>
                        {
                            <p className={isError ? "resMsg error" : "resMsg"}>
                                {resMsg}
                            </p>
                        }
                    </form>
                    <button disabled={isReqProcessing} onClick={() => handleCheckout()} className="payBtn">
                        Enroll Now
                    </button>
                </div>
                <div className="userDetailRight">
                    <div className="userDetailCard">
                        <h3 className="cardTitle">
                            Student Details
                        </h3>
                        <div className="detailBox">
                            <div className="boxRight">
                                <p className="username">
                                    {userDetails.name || "Username"}
                                </p>
                                <p className="useremail">
                                    {userDetails.email || "Email"}
                                </p>
                                <p>
                                    {userDetails.phone || "Phone"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="planDetailCard">
                        <h3 className="cardTitle">
                            Course Details
                        </h3>
                        <div className="detailBox">
                            <p className="dates">
                                {userSelectedCourse?.title}
                            </p>
                            <p className="dateValue">
                                {userSelectedCourse?.duration}
                            </p>

                            <p className="dates">
                                Batch
                            </p>
                            <p className="dateValue">
                                {userSelectedBatch.name}
                            </p>
                            <p className="dates">
                                Daily Time
                            </p>
                            <p className="dateValue">
                                {userSelectedCourse?.dailytime}
                            </p>
                            <p className="timeSlot">
                                Time Slot
                            </p>
                            <p className="timeValue">
                                {userSelectedCourse?.time}
                            </p>
                        </div>
                        <div className="paymentDetailBox">
                            <div className="boxLeft">
                                <p>
                                    Payment
                                </p>
                            </div>
                            <div className="boxRight">
                                <p className="totalAmount">
                                    {finalPrice}/- INR
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserDetail