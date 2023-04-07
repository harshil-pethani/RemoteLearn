import axios from 'axios'
import React, { useState } from 'react'
import { newsLetterSubscribeApi } from '../Config/Api'

const Subscribe = () => {
    const [useremail, setUseremail] = useState("");
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");
    const [isReqProcessing, setIsReqProcessing] = useState(false);

    const handleSubscribe = async () => {
        let res;
        try {
            setIsReqProcessing(true);
            setResMsg("");
            res = await axios.post(newsLetterSubscribeApi, {
                email: useremail.toLowerCase()
            })
            if (res.status === 200) {
                setIsReqProcessing(false);
                setIsError(false);
                setResMsg(res.data);
            }
        } catch (e) {
            setIsError(true);
            setIsReqProcessing(false);
            // console.log(e.response.status);
            if (e.response.status === 400) {
                setResMsg(e.response.data);
            } else {
                setResMsg("Something went wrong");
            }
        }
    }

    return (
        <div className="subscribe">
            <div className="left">
                <p>
                    Subscribe our News-letter to get latest
                    updates regarding new courses.
                </p>
            </div>
            <div className="right">
                <div className="container">
                    <ion-icon name="mail-outline"></ion-icon>
                    <input value={useremail} onChange={(e) => setUseremail(e.target.value.toLowerCase())} type="email" placeholder="E-mail address" />
                    <button disabled={isReqProcessing} onClick={handleSubscribe} className="btn">
                        Submit
                    </button>
                </div>
                <p className={isError ? "resMsg error" : "resMsg"}>
                    {resMsg}
                </p>
            </div>
        </div>
    )
}

export default Subscribe