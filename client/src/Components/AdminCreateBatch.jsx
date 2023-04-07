import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import uuid from 'react-uuid';
import { createBatchApi } from '../Config/Api';
import AdminSide from './AdminSide';
import AdminTop from './AdminTop';
import Loader from './Loader';

const AdminCreateBatch = ({ adminDetails, setAdminLogged }) => {
    const [courseId, setCourseId] = useState("");
    const [curBatchData, setCurBatchData] = useState({ name: "", startdate: "", enddate: "", batchstatus: "Enroll", starttime: "", endtime: "" });
    const [dropDownActive, setDropDownActive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        setCourseId(location.pathname.split("/")[3]);
    }, [location]);

    const validateData = () => {
        if (!curBatchData.name || !curBatchData.startdate || !curBatchData.enddate || !curBatchData.batchstatus || !curBatchData.starttime || !curBatchData.endtime) {
            setIsError(true);
            setResMsg("Please fill out all the Fields ");
            return false;
        } else if (curBatchData.startdate > curBatchData.enddate) {
            setIsError(true);
            setResMsg("Please Enter Valid Date");
            return false;
        } else if (curBatchData.starttime > curBatchData.endtime) {
            setIsError(true);
            setResMsg("Please Enter Valid time");
            return false;
        }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const createSlot = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                setIsLoading(true);
                const res = await axios.post(createBatchApi, { ...curBatchData, courseid: courseId }, { withCredentials: true })
                if (res.status === 201) {
                    setIsLoading(false);
                    navigate(`/admin/course/${courseId}`)
                    console.log(res);
                }
            } catch (e) {
                setIsLoading(false);
                setIsError(true);
                console.log(e);
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
                <AdminSide adminDetails={adminDetails} setAdminLogged={setAdminLogged} />
                {
                    isLoading ?
                        <Loader adminLoader={true} /> :
                        <div className="adminCreateSlot right">
                            <h2 className="title">
                                Create New Batch
                            </h2>
                            <form>
                                <div className="formField">
                                    <label className="fieldTitle" htmlFor="batchname">
                                        Batch Name<span>*</span>
                                    </label>
                                    <input value={curBatchData?.name} onChange={(e) => setCurBatchData({ ...curBatchData, name: e.target.value })} id="batchname" type="text" placeholder="Enter Batch name" />
                                </div>
                                <div className="formField">
                                    <div className="dateBox">
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="startdate">
                                                Start Date<span>*</span>
                                            </label>
                                            <input value={curBatchData.startdate} onChange={(e) => setCurBatchData({ ...curBatchData, startdate: e.target.value })} id="startdate" type="date" />
                                        </div>
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="enddate">
                                                End Date<span>*</span>
                                            </label>
                                            <input value={curBatchData.enddate} onChange={(e) => setCurBatchData({ ...curBatchData, enddate: e.target.value })} id="enddate" type="date" />
                                        </div>
                                    </div>
                                </div>
                                <div className="formField">
                                    <div className="dateBox">
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="starttime">
                                                Start Time<span>*</span>
                                            </label>
                                            <input value={curBatchData.starttime} onChange={(e) => setCurBatchData({ ...curBatchData, starttime: e.target.value })} id="starttime" type="time" />
                                        </div>
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="endtime">
                                                End Time<span>*</span>
                                            </label>
                                            <input value={curBatchData.endtime} onChange={(e) => setCurBatchData({ ...curBatchData, endtime: e.target.value })} id="endtime" type="time" />
                                        </div>
                                    </div>
                                </div>
                                <div className="formField">
                                    <label className="fieldTitle" htmlFor="batchstatus">
                                        Batch Status
                                    </label>
                                    <div className="dropDown">
                                        <div onClick={() => setDropDownActive(!dropDownActive)} className="dropDown-Btn">
                                            {curBatchData?.batchstatus}
                                            <ion-icon name="caret-down-outline"></ion-icon>
                                        </div>
                                        {
                                            dropDownActive &&
                                            <div className="dropDown-content">
                                                <div onClick={(e) => {
                                                    setCurBatchData({ ...curBatchData, batchstatus: "Closed" });
                                                    setDropDownActive(false);
                                                }} className="dropDown-item">
                                                    Closed
                                                </div>
                                                <div onClick={(e) => {
                                                    setCurBatchData({ ...curBatchData, batchstatus: "Enroll" });
                                                    setDropDownActive(false);
                                                }} className="dropDown-item">
                                                    Enroll
                                                </div>
                                                <div onClick={(e) => {
                                                    setCurBatchData({ ...curBatchData, batchstatus: "Notify Me" });
                                                    setDropDownActive(false);
                                                }} className="dropDown-item">
                                                    Notify Me
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>

                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button className="submit" onClick={createSlot}>
                                    Create <ion-icon name="arrow-forward"></ion-icon>
                                </button>
                            </form>
                        </div>
                }
            </div>
        </div>
    )
}

export default AdminCreateBatch