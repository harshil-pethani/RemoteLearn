import axios from 'axios';
import React, { useState } from 'react'
import logoImg from "../Assets/logo.png";
import loginIllustrator from "../Assets/login.png";
import { Link } from 'react-router-dom';
import Loader from '../Components/Loader';
import { forgotPassowrdApi, loginApi, registerApi } from '../Config/Api';

const AdminLogin = ({ setAdminLogged, setAdminDetails }) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [registerCredentials, setRegisterCredentials] = useState({ email: "", username: "", password: "" });
    const [forgotEmail, setForgotEmail] = useState("");
    // const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");

    const [activeBox, setActiveBox] = useState("loginBox");

    const validateData = () => {
        if (!credentials.email || !credentials.password) {
            setIsError(true);
            setResMsg("Please fill out all the Fields ");
            return false;
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(credentials.email))) {
            setIsError(true);
            setResMsg("Please Enter Valid Email Address");
            return false;
        }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const validateRegisterData = () => {
        if (!registerCredentials.email || !registerCredentials.password || !registerCredentials.username) {
            setIsError(true);
            setResMsg("Please fill out all the Fields ");
            return false;
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(registerCredentials.email))) {
            setIsError(true);
            setResMsg("Please Enter Valid Email Address");
            return false;
        }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const validateEmail = () => {
        // console.log(forgotEmail);
        if (!forgotEmail) {
            setIsError(true);
            setResMsg("Please fill out all the Fields ");
            return false;
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(forgotEmail))) {
            setIsError(true);
            setResMsg("Please Enter Valid Email Address");
            return false;
        }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                setIsLoading(true);
                const loginRes = await axios.post(loginApi, credentials, { withCredentials: true });
                if (loginRes?.status === 200) {
                    setIsLoading(false);
                    setAdminLogged(true);
                    setAdminDetails(loginRes.data);
                    // console.log(loginRes.data)
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

    const handleRegister = async (e) => {
        e.preventDefault();
        if (validateRegisterData()) {
            try {
                setIsLoading(true);
                const registerRes = await axios.post(registerApi, registerCredentials, { withCredentials: true });
                if (registerRes?.status === 200) {
                    setIsLoading(false);
                    setResMsg("Registration successful, Try to Login");
                    setRegisterCredentials({ email: "", username: "", password: "" })
                    // console.log(registerRes)
                }
            } catch (e) {
                setIsLoading(false);
                setIsError(true);
                if (e.response.status === 400) {
                    setResMsg(e.response.data);
                } else if (e.response.status === 409) {
                    setResMsg(e.response.data);
                } else {
                    setResMsg("Sorry, Something went wrong - Please try after some time.");
                }
            }
        }
    }

    const handleForgotBtn = async (e) => {
        e.preventDefault();
        if (validateEmail()) {
            try {
                setIsLoading(true);
                const res = await axios.post(forgotPassowrdApi, { email: forgotEmail }, { withCredentials: true });
                if (res?.status === 200) {
                    setIsLoading(false);
                    setIsError(false);
                    setResMsg("Password Reset URL is Sent to your Email.")
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
            <div className="adminlogin">
                <div className="left">
                    <Link to="/">
                        <img loading="lazy" src={logoImg} alt="" />
                    </Link>
                    <img className="adminLogo" loading="lazy" src={loginIllustrator} alt="" />
                </div>
                <div className="right">
                    {
                        activeBox === "loginBox"
                        &&
                        <div className="loginBox">
                            <h2 className="title">
                                Welcome Back!
                            </h2>
                            <h3 className='slogan'>
                                Login to Continue
                            </h3>
                            <form>
                                <label htmlFor="email">
                                    Email<span>*</span>
                                </label>
                                <input id="email" value={credentials.email} type="email" onChange={(e) => setCredentials({ ...credentials, email: e.target.value.toLowerCase() })} />

                                <label htmlFor="password">
                                    Password<span>*</span>
                                </label>
                                <input id="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} type="password" />
                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button disabled={isLoading} onClick={handleLogin}>
                                    Login
                                </button>
                            </form>
                            <span className="subLink" onClick={() => { setResMsg(""); setActiveBox("forgotBox") }}>
                                Forgot Password?
                            </span>
                            <span className="subLink" onClick={() => { setResMsg(""); setActiveBox("register") }}>
                                Register for new Admin
                            </span>
                        </div>
                    }
                    {
                        activeBox === "register"
                        &&
                        <div className="loginBox">
                            <h2 className="title">
                                Welcome Back!
                            </h2>
                            <h3 className='slogan'>
                                Register new Admin
                            </h3>
                            <form>
                                <label htmlFor="email">
                                    Email<span>*</span>
                                </label>
                                <input id="email" value={registerCredentials.email} type="email" onChange={(e) => setRegisterCredentials({ ...registerCredentials, email: e.target.value.toLowerCase() })} />

                                <label htmlFor="username">
                                    Username<span>*</span>
                                </label>
                                <input id="username" value={registerCredentials.username} type="text" onChange={(e) => setRegisterCredentials({ ...registerCredentials, username: e.target.value.toLowerCase() })} />

                                <label htmlFor="password">
                                    Password<span>*</span>
                                </label>
                                <input id="password" value={registerCredentials.password} onChange={(e) => setRegisterCredentials({ ...registerCredentials, password: e.target.value })} type="password" />
                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button disabled={isLoading} onClick={handleRegister}>
                                    Register
                                </button>
                            </form>
                            <span className="subLink" onClick={() => { setResMsg(""); setActiveBox("loginBox") }}>
                                Back to Login !
                            </span>
                        </div>
                    }
                    {
                        activeBox === "forgotBox"
                        &&
                        <div className="loginBox">
                            <h2 className="title">
                                Forgot Password ?
                            </h2>
                            <p className="instruction">
                                Enter your Email id. We will send you forgot password URL.
                            </p>
                            <form>
                                <label htmlFor="email">
                                    Email<span>*</span>
                                </label>
                                <input id='email' value={forgotEmail} type="email" onChange={(e) => setForgotEmail(e.target.value.toLowerCase())} />
                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button disabled={isLoading} onClick={handleForgotBtn}>
                                    Send
                                </button>
                            </form>
                            <span className="subLink" onClick={() => { setResMsg(""); setActiveBox("loginBox") }}>
                                Back to Login !
                            </span>
                        </div>
                    }
                </div>
            </div>
    )
}

export default AdminLogin