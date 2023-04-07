import React, { useState } from 'react'
import AdminSide from './AdminSide'
import AdminTop from './AdminTop'
import { createCourseApi } from '../Config/Api';
import axios from 'axios';
import Loader from './Loader';


const AdminCreateCourse = ({ adminDetails, setAdminLogged }) => {
    const [curCourse, setCurCourse] = useState({ title: "", description: "", topics: "", courseduration: "", dailytime: "", price: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");
    const [renderPage, setRenderPage] = useState(1);


    const validateData = () => {
        if (!curCourse.title || !curCourse.description || !curCourse.topics || !curCourse.courseduration || !curCourse.dailytime || !curCourse.price) {
            setIsError(true);
            setResMsg("Please fill out all the Fields ");
            return false;
        } else if (curCourse.title.length < 5) {
            setIsError(true);
            setResMsg("Title is very small");
            return false;
        } else if (curCourse.description.length < 20) {
            setIsError(true);
            setResMsg("Description is very small");
            return false;
        } else if (curCourse.topics.length < 5) {
            setIsError(true);
            setResMsg("Please enter some topics");
            return false;
        } else if (curCourse.price < 0) {
            setIsError(true);
            setResMsg("Price must be positive");
            return false;
        } else if (curCourse.courseduration <= 0) {
            setIsError(true);
            setResMsg("Course Duration time should be greater than 0");
            return false;
        } else if (curCourse.dailytime <= 0) {
            setIsError(true);
            setResMsg("Daily time should be greater than 0");
            return false;
        }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const createCourse = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                setIsLoading(true);
                const res = await axios.post(createCourseApi, { ...curCourse }, { withCredentials: true });
                if (res.status === 201) {
                    setIsError(false);
                    setIsLoading(false);
                    setRenderPage(renderPage + 1);
                    setCurCourse({ title: "", description: "", topics: "", courseduration: "", dailytime: "", price: "" });
                }
            } catch (e) {
                setIsError(true);
                setIsLoading(false);
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
        <div>
            <AdminTop adminDetails={adminDetails} />
            <div className="adminMainContent">
                <AdminSide adminDetails={adminDetails} renderPage={renderPage} setAdminLogged={setAdminLogged} />
                {
                    isLoading ?
                        <Loader adminLoader={true} /> :
                        <div className="adminCreateCohort right">
                            <h2 className="title">
                                Create new Course
                            </h2>
                            <form>
                                <div className="formField">
                                    <label className="fieldTitle" htmlFor="courseName">
                                        Course Title<span>*</span>
                                    </label>
                                    <input value={curCourse.title} onChange={(e) => setCurCourse({ ...curCourse, title: e.target.value })} id="courseName" type="text" placeholder="Enter Course Title" />
                                </div>
                                <div className="formField">
                                    <label className="fieldTitle" htmlFor="courseDescription">
                                        Course Description (Add $ sign to seperate the paragraph)<span>*</span>
                                    </label>
                                    <textarea value={curCourse?.description} onChange={(e) => setCurCourse({ ...curCourse, description: e.target.value })} id="courseDescription" type="text" placeholder="Enter Course Description" />
                                </div>
                                <div className="formField">
                                    <label className="fieldTitle" htmlFor="courseTopics">
                                        Topics that will be Covered (Comma seperated)<span>*</span>
                                    </label>
                                    <textarea value={curCourse?.topics} onChange={(e) => setCurCourse({ ...curCourse, topics: e.target.value })} id="courseTopics" type="text" placeholder="Enter Topics that will be covered" />
                                </div>
                                <div className="formField">
                                    <div className="dateBox">
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="courseDuration">
                                                Course Duration<span>*</span>
                                            </label>
                                            <input onChange={(e) => setCurCourse({ ...curCourse, courseduration: e.target.value })} value={curCourse?.courseduration} id="courseDuration" type="number" placeholder="Number of Months" />
                                        </div>
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="dailyTime">
                                                Daily Time<span>*</span>
                                            </label>
                                            <input onChange={(e) => setCurCourse({ ...curCourse, dailytime: e.target.value })} value={curCourse?.dailytime} id="dailyTime" type="number" placeholder="Number of Hours" />
                                        </div>
                                    </div>
                                </div>
                                <div className="formField">
                                    <div className="dateBox">
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="coursePrice">
                                                Course Price (In INR)<span>*</span>
                                            </label>
                                            <input onChange={(e) => setCurCourse({ ...curCourse, price: e.target.value })} value={curCourse?.price} id="coursePrice" type="number" placeholder="Amount" />
                                        </div>
                                        {/* <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="faculty">
                                                Faculty Name<span>*</span>
                                            </label>
                                            <input onChange={(e) => setCurCourse({ ...curCourse, faculty: e.target.value })} value={curCourse?.faculty} id="faculty" type="text" placeholder="Faculty" />
                                        </div> */}
                                    </div>
                                </div>
                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button className='submit' onClick={createCourse}>
                                    Create <ion-icon name="arrow-forward"></ion-icon>
                                </button>
                            </form>
                        </div>
                }
            </div>

        </div>
    )
}

export default AdminCreateCourse