import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import logoImg from "../Assets/logoBig.png";
import logoImg from "../Assets/logo.png";
import loginIllustrator from "../Assets/login.png";
import Loader from '../Components/Loader';
import { Link } from 'react-router-dom';
import { resetPasswordApi, resetTokenVerify } from '../Config/Api';

const AdminReset = () => {
    const [credentials, setCredentials] = useState({ newPassword: "", retypePassword: "" });

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");

    const [tokenVerified, setTokenVerified] = useState(false);
    const [userId, setUserId] = useState("");
    const [tokenErrorMsg, setTokenErrorMsg] = useState("Wait For a Moment ... ");
    const location = useLocation();
    const navigate = useNavigate();


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("reset_password_token");

        const checkToken = async (token) => {
            try {
                setIsLoading(true);
                const res = await axios.post(resetTokenVerify, { token }, { withCredentials: true });

                if (res?.status === 200) {
                    setIsLoading(false);
                    setTokenVerified(true);
                    setUserId(res.data.userId);
                    console.log(res);
                } else {
                    setIsLoading(false);
                    setTokenVerified(false);
                    setTokenErrorMsg(res.data);
                }
            } catch (e) {
                setIsLoading(false);
                setTokenVerified(false);
                console.log(e);
                if (e.response.status === 400) {
                    setTokenErrorMsg(e.response.data);
                } else if (e.response.status === 500 && e.response.data.name === "TokenExpiredError") {
                    setTokenErrorMsg("Password Reset URL is Expired");
                } else {
                    setTokenErrorMsg("Sorry, Something went wrong - Please try after some time.");
                }
            }
        }
        checkToken(token);
    }, []);

    const validateData = () => {
        if (!credentials.newPassword || !credentials.retypePassword) {
            setIsError(true);
            setResMsg("Please fill out all the Fields ");
            return false;
        } else if (credentials.newPassword.length < 6) {
            setIsError(true);
            setResMsg("Password should be more than 6 characters");
            return false;
        } else if (credentials.newPassword !== credentials.retypePassword) {
            setIsError(true);
            setResMsg("Both field must be same");
            return false;
        }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const handleResetPass = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                setIsLoading(true);
                const res = await axios.put(resetPasswordApi, { userId, ...credentials }, { withCredentials: true });
                if (res?.status === 200) {
                    setIsLoading(false);
                    setIsError(false);
                    setResMsg(res.data);
                }
            } catch (e) {
                setIsLoading(false);
                setIsError(true);
                if (e.response.status === 400) {
                    setResMsg(e.response.data);
                } else {
                    setResMsg("Sorry, Something went wrong - Please try after some time.");
                }
            }
        }
    }

    return (
        isLoading ?
            <Loader /> :
            tokenVerified ?
                <div className="adminlogin">
                    <div className="left">
                        <Link to="/">
                            <img loading="lazy" src={logoImg} alt="" />
                        </Link>
                        <img className="adminLogo" loading="lazy" src={loginIllustrator} alt="" />
                    </div>
                    <div className="right">
                        <div className="loginBox">
                            <h2 className="title">
                                Reset Password
                            </h2>
                            <form>
                                <label htmlFor="password">
                                    New Password<span>*</span>
                                </label>
                                <input id='password' value={credentials.newPassword} type="password" onChange={(e) => setCredentials({ ...credentials, newPassword: e.target.value })} />

                                <label htmlFor="retypepassword">
                                    Retype Password<span>*</span>
                                </label>
                                <input id='retypepassword' value={credentials.retypePassword} onChange={(e) => setCredentials({ ...credentials, retypePassword: e.target.value })} type="password" />
                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button disabled={isLoading} onClick={handleResetPass}>
                                    Reset Password
                                </button>
                            </form>
                            <span className="subLink" onClick={() => navigate("/admin")}>
                                Back to Login !
                            </span>
                        </div>
                    </div>
                </div>
                :
                <div className="adminlogin">
                    <div className="left">
                        <Link to="/">
                            <img loading="lazy" src={logoImg} alt="" />
                        </Link>
                        <img className="adminLogo" loading="lazy" src={loginIllustrator} alt="" />
                    </div>
                    <div className="right">
                        <div className="loginBox">
                            <h1 className="tokenError">
                                {tokenErrorMsg}
                                <br />
                                <br />

                                <span className="subLink" onClick={() => navigate("/admin")}>
                                Back to Login !
                                </span>
                            </h1>
                        </div>
                    </div>
                </div>
    )
}

export default AdminReset;