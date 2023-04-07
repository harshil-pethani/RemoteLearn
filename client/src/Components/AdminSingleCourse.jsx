import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getDate } from '../Data'
import AdminSide from './AdminSide'
import AdminTop from './AdminTop'
import editBtn from "../Assets/editBtn.png";
import deleteBtn from "../Assets/deleteBtn.png";
import axios from 'axios'
import { deleteCourseApi, deleteBatchApi, getSingleCourseApi, updateCourseApi, approveCourseApi } from '../Config/Api'
import Loader from './Loader'

const AdminSingleCourse = ({ adminDetails, setAdminLogged }) => {
    const [curCourse, setCurCourse] = useState({ title: "", description: "", topics: "", price: "", courseduration: "", dailytime: "" });
    const [curBatches, setCurBatches] = useState([]);
    const [courseId, setCourseId] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");
    const [renderPage, setRenderPage] = useState(1);


    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setCourseId(location.pathname.split("/")[3])
        console.log(courseId)
    }, [location]);

    useEffect(() => {
        const findCourse = async () => {
            try {
                if (courseId) {
                    setIsLoading(true);
                    const res = await axios.get(getSingleCourseApi(courseId), { withCredentials: true });
                    if (res.status === 200) {
                        setCurCourse(res?.data?.course);
                        setCurBatches(res?.data?.batches);
                        setIsLoading(false);
                    }
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        }
        if (courseId) {
            findCourse();
        }
    }, [courseId, renderPage]);

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


    const updatePlan = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                setIsLoading(true);
                const res = await axios.put(updateCourseApi(courseId), curCourse, { withCredentials: true });
                if (res.status === 200) {
                    setResMsg("Course details updated successfully");
                    setIsError(false);
                    setRenderPage(renderPage + 1);
                    setIsLoading(false);
                }
            } catch (e) {
                setIsLoading(false);
                setIsError(true);
                if (e.response.status === 400) {
                    setResMsg(e.response.data);
                } else if (e.response.status === 500) {
                    setResMsg(e.response.data);
                } else {
                    setResMsg("Sorry, Something went wrong - Please try after some time.");
                }
                console.log(e);
            }
        }
    }

    const deleteCohort = async () => {
        if (window.confirm("Are you sure want to Delete this Cohort ? ")) {
            try {
                setIsLoading(true);
                const res = await axios.delete(deleteCourseApi(courseId), { withCredentials: true });

                if (res.status === 200) {
                    setIsLoading(false);
                    setRenderPage(renderPage + 1);
                    navigate("/admin/course/createcourse");
                }
            } catch (e) {
                setIsLoading(false);
                setIsError(true);
                if (e.response.status === 400) {
                    setResMsg(e.response.data);
                } else if (e.response.status === 500) {
                    setResMsg(e.response.data);
                } else {
                    setResMsg("Sorry, Something went wrong - Please try after some time.");
                }
                console.log(e);
            }
        }
    }

    const deleteSlot = async (batchId) => {
        if (window.confirm("Are you sure you want to delete this Batch?")) {
            try {
                setIsLoading(true);
                const res = await axios.post(deleteBatchApi(batchId), {
                    courseid: courseId
                }, { withCredentials: true })

                if (res.status === 200) {
                    setIsLoading(false);
                    setIsError(false);
                    setRenderPage(renderPage + 1);
                }
            } catch (e) {
                setIsLoading(false);
                setIsError(true);
                if (e.response.status === 400) {
                    setResMsg(e.response.data);
                } else if (e.response.status === 500) {
                    setResMsg(e.response.data);
                } else {
                    setResMsg("Sorry, Something went wrong - Please try after some time.");
                }
                console.log(e);
            }
        }
    }

    const approveCourse = async () => {
        if (window.confirm("Are you sure you want to Approve this Course?")) {
            try {
                setIsLoading(true);
                const res = await axios.post(approveCourseApi, curCourse, { withCredentials: true })
                if (res.status === 200) {
                    setIsLoading(false);
                    setIsError(false);
                    setRenderPage(renderPage + 1);
                    navigate("/admin/course")
                }
            } catch (e) {
                setIsLoading(false);
                setIsError(true);
                if (e.response.status === 400) {
                    setResMsg(e.response.data);
                } else if (e.response.status === 500) {
                    setResMsg(e.response.data);
                } else {
                    setResMsg("Sorry, Something went wrong - Please try after some time.");
                }
                console.log(e);
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
                        <div className="adminSingleCohort right">
                            <div className="topCohortBar">
                                <h2 className="title">
                                    {curCourse?.title}
                                </h2>
                                {
                                    adminDetails.usertype === "owner" && curCourse.status !== "pending" &&
                                    <button onClick={deleteCohort} className="deleteCohort">
                                        Delete <ion-icon name="arrow-forward"></ion-icon>
                                    </button>
                                }
                                {
                                    adminDetails.usertype === "owner" && curCourse.status === "pending" &&
                                    <div style={{ display: "flex", gap: "20px" }}>
                                        <button onClick={() => approveCourse("approved")} className="approveCourse">
                                            Approve <ion-icon name="arrow-forward"></ion-icon>
                                        </button>
                                        <button onClick={deleteCohort} className="deleteCohort">
                                            Reject <ion-icon name="arrow-forward"></ion-icon>
                                        </button>
                                    </div>
                                }
                            </div>
                            {
                                curCourse.status === "pending" &&
                                <p style={{ color: "red" }}>
                                    Currently this course is not approved.
                                </p>
                            }
                            <form>
                                <div className="formField">
                                    <label className="fieldTitle" htmlFor="courseName">
                                        Course Title<span>*</span>
                                    </label>
                                    <input value={curCourse?.title} onChange={(e) => setCurCourse({ ...curCourse, title: e.target.value })} id="courseName" type="text" placeholder="Enter Course Title" />
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
                                                Course Duration (In Months)<span>*</span>
                                            </label>
                                            <input onChange={(e) => setCurCourse({ ...curCourse, courseduration: e.target.value })} value={curCourse?.courseduration} id="courseDuration" type="number" placeholder="Number of Months" />
                                        </div>
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="dailyTime">
                                                Daily Time (In Hours)<span>*</span>
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
                                    </div>
                                </div>
                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button className='submit' onClick={updatePlan}>
                                    Update <ion-icon name="arrow-forward"></ion-icon>
                                </button>
                            </form>
                            <h1 style={{ fontWeight: "400", marginTop: "50px" }}>
                                Batch Details
                            </h1>
                            {
                                curBatches.length > 0 ?
                                    <div className="tableDiv" style={{ overflow: "auto" }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Batch Name</th>
                                                    <th>Start Date</th>
                                                    <th>End Date</th>
                                                    <th>Start Time</th>
                                                    <th>End Time</th>
                                                    <th>Status</th>
                                                    <th>Edit</th>
                                                    <th>Delete</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    curBatches?.map((batch, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                {batch.name}
                                                            </td>
                                                            <td>
                                                                {getDate(batch?.startdate)}
                                                            </td>
                                                            <td>
                                                                {getDate(batch?.enddate)}
                                                            </td>
                                                            <td>
                                                                {batch?.starttime}
                                                            </td>
                                                            <td>
                                                                {batch?.endtime}
                                                            </td>
                                                            <td className={"status " + batch?.batchstatus}>
                                                                {batch?.batchstatus}
                                                            </td>
                                                            <td className="edit">
                                                                <button onClick={() => navigate(`/admin/course/${courseId}/${batch._id}`)}>
                                                                    <img src={editBtn} alt="" />
                                                                </button>
                                                            </td>
                                                            <td className="end">
                                                                <button onClick={() => deleteSlot(batch._id)}>
                                                                    <img src={deleteBtn} alt="" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>

                                        </table>
                                    </div> :
                                    <h2 style={{ fontWeight: "400", marginTop: "50px", textAlign: "center" }}>
                                        Currently, Zero batches available in this course
                                    </h2>
                            }
                            {
                                curCourse.status === "approved" &&
                                <div className="bottomCohortBar">
                                    <button onClick={() => navigate(`/admin/course/${courseId}/createslot`)} className="addSlot">
                                        Add Batch <ion-icon name="arrow-forward"></ion-icon>
                                    </button>
                                </div>
                            }
                        </div>
                }
            </div>
        </div>
    )
}

export default AdminSingleCourse