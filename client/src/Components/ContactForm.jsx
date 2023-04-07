import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { submitContactFormApi } from '../Config/Api';

const ContactForm = () => {
    const [formData, setFormData] = useState({ firstname: "", lastname: "", email: "", message: "" });
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");
    const [isReqProcessing, setIsReqProcessing] = useState(false);

    const validateData = () => {
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.message) {
            setIsError(true);
            setResMsg("Please fill out all the fields ");
            return false;
        } else if (formData.firstname.length < 3 || formData.lastname.length < 3) {
            setIsError(true);
            setResMsg("Please Enter Valid Firstname and Lastname");
            return false;
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))) {
            setIsError(true);
            setResMsg("Please Enter Valid Email Address");
            return false;
        } else if (formData.message.length < 10) {
            setIsError(true);
            setResMsg("Please Describe your Message properly (Message is Too Short)");
            return false;
        }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                // setIsLoading(true);
                setIsReqProcessing(true);
                const res = await axios.post(submitContactFormApi, formData);
                if (res.status === 200) {
                    // setIsLoading(false);
                    setIsReqProcessing(false);
                    setResMsg(res.data);
                    setIsError(false);
                    setFormData({ firstname: "", lastname: "", email: "", message: "" });
                    // console.log("Message Send success");
                }
            } catch (e) {
                // setIsLoading(false);
                // console.log(e)
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

    return (
        // isLoading ?
        //     <Loader height={"130px"} />
        //     :
        <div className="contactForm">
            <div className="left">
                <h1 className="title">
                    Let us know how we
                    can help
                </h1>
                <p className="desc">
                    GET IN TOUCH WITH US TODAY TO SCHEDULE A 15-MINUTE CONSULTATION- LET’S TALK THROUGH YOUR GOALS AND HOW WE CAN BE HELPFUL. YOUR PATH FORWARD STARTS TODAY!
                </p>

                <div className="detail">
                    <p>
                        Phone:
                    </p>
                    <p>
                        210-983-1097
                    </p>
                </div>
                <div className="detail">
                    <p>
                        Email:
                    </p>
                    <p>
                        admin@remotelearn.org
                    </p>
                </div>
            </div>
            <div className="right">
                <form action="">
                    <label className="mainLabel">
                        Name*
                    </label>
                    <div className="formField">
                        <div className="subformField half">
                            <input value={formData.firstname} onChange={(e) => setFormData({ ...formData, firstname: e.target.value })} type="text" id='firstname' />
                            <label className="labelSpan" htmlFor="firstname">First Name</label>
                        </div>
                        <div className="subformField half">
                            <input value={formData.lastname} onChange={(e) => setFormData({ ...formData, lastname: e.target.value })} type="text" id='lastname' />
                            <label className="labelSpan" htmlFor='lastname'>Last Name</label>
                        </div>
                    </div>
                    <label className="mainLabel" htmlFor="emailid">
                        Email*
                    </label>
                    <div className="formField">
                        <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value.toLowerCase() })} id='emailid' type="email" />
                    </div>
                    <label className="mainLabel" htmlFor="message">
                        Message*
                    </label>
                    <div className="formField">
                        <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} id='message' type="text" />
                    </div>
                    <p className={isError ? "resMsg error" : "resMsg"}>
                        {resMsg}
                    </p>

                    <button disabled={isReqProcessing} onClick={submitForm} type="submit" className="btn submit">
                        Send <ion-icon name="arrow-forward"></ion-icon>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ContactForm;