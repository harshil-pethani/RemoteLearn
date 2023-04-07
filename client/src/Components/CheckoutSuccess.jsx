import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getPurchasedCohortApi } from '../Config/Api'
import { getDate } from '../Data'
import Loader from './Loader'

import checkoutsuccessImg from "../Assets/checkoutSuccess.png";
import Navbar from './Navbar'

// stripe listen --forward-to http://localhost:5000/api/checkout/webhook


const CheckoutSuccess = () => {
    const [purchasedData, setPurchasedData] = useState([]);
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [orderTotal, setOrderTotal] = useState("");

    // console.log(purchasedData);

    useEffect(() => {
        const getData = async () => {
            try {
                let ids = location.pathname.split("/");
                let courseid = ids[3];
                let batchid = ids[4];
                let orderAmount = ids[5];
                setOrderTotal(orderAmount);
                setIsLoading(true);
                const res = await axios.post(getPurchasedCohortApi, {
                    courseid,
                    batchid,
                });
                if (res.status === 200) {
                    setIsLoading(false);
                    setPurchasedData(res.data);
                }
            } catch (e) {
                setIsLoading(false);
                // console.log(e);
            }
        }
        getData();
    }, []);

    return (

        isLoading ?
            <Loader /> :
            <div className="checkoutSuccess">
                <Navbar />
                <div className="checkoutSuccessleft">
                    <h2 className="title">
                        Your payment has been successful and {purchasedData.trainername} is ready for you!
                    </h2>
                    <p className="subtitle">
                        Please keep an eye out for the following emails:
                    </p>
                    <ul>
                        <li>
                            DocuSign for the Order Form & our standard Student Agreement
                        </li>
                        <li>
                            Calendar Invite for the classes (will be sent 24 hrs before the first class)
                        </li>
                    </ul>
                    <div className="detail">
                        <div className="detailLeft">
                            <div className="icon">
                                <ion-icon name="library-outline"></ion-icon>
                            </div>
                        </div>
                        <div className="detailRight">
                            <p className="key">
                                Course Name
                            </p>
                            <p className="value">
                                {purchasedData?.findCourse?.title}
                            </p>
                        </div>
                    </div>
                    <div className="detail">
                        <div className="detailLeft">
                            <div className="icon">
                                <ion-icon name="ticket-outline"></ion-icon>
                            </div>
                        </div>
                        <div className="detailRight">
                            <p className="key">
                                Ticket
                            </p>
                            <p className="value">
                                Order total: ₹ {orderTotal}/-
                            </p>
                        </div>
                    </div>
                    <div className="detail">
                        <div className="detailLeft">
                            <div className="icon">
                                <ion-icon name="time-outline"></ion-icon>
                            </div>
                        </div>
                        <div className="detailRight">
                            <p className="key">
                                Batch : {purchasedData?.findBatch?.name}
                            </p>
                            <p className='key'>
                                {/* {purchasedData.starttime} to {purchasedData.endtime} EST */}
                                Time : {purchasedData?.findBatch?.starttime} to {purchasedData?.findBatch?.endtime}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="checkoutSuccessright">
                    <img src={checkoutsuccessImg} alt="" />
                </div>
            </div>


    )
}

export default CheckoutSuccess