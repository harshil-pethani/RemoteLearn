import React, { useEffect, useState } from 'react'
import Loader from './Loader';
import AdminSide from './AdminSide'
import AdminTop from './AdminTop'
import axios from 'axios';
import { getGlanceApi, updateGlanceApi } from '../Config/Api';

const AdminGlance = ({ adminDetails, setAdminLogged }) => {
    const [ourDetails, setOurDetails] = useState({ teachers: "", trainedstudents: "", placedstudents: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");

    const [detailId, setDetailId] = useState("");

    useEffect(() => {
        const getOurDetails = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(getGlanceApi, { withCredentials: true });
                if (res.status === 200) {
                    setOurDetails({
                        teachers: res.data.teachers,
                        trainedstudents: res.data.trainedstudents,
                        placedstudents: res.data.placedstudents
                    });
                    setDetailId(res.data._id);
                    setIsLoading(false);
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        }
        getOurDetails();
    }, []);

    const updateOurDetails = async (e) => {
        e.preventDefault();
        if (!ourDetails.teachers || !ourDetails.trainedstudents || !ourDetails.placedstudents) {
            setIsError(true);
            setResMsg("Please fill out all the Fields ");
            return false;
        } else {
            try {
                setIsLoading(true);
                const res = await axios.put(updateGlanceApi(detailId), { ...ourDetails, usertype: adminDetails.usertype }, { withCredentials: true });
                if (res.status === 200) {
                    setIsLoading(false);
                    setIsError(false);
                    setResMsg(res.data);
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
                console.log(e);
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
                        <div className="right adminGlance">
                            <h2 className="title">
                                At a Glance
                            </h2>
                            <form>
                                <div className="fields">
                                    <div className="formField">
                                        <label className="fieldTitle" htmlFor="teachers">
                                            Certified Teachers<span>*</span>
                                        </label>
                                        <input onChange={(e) => setOurDetails({ ...ourDetails, teachers: parseInt(e.target.value) })} id="teachers" value={ourDetails?.teachers} type="number" placeholder="No. of Certified Teachers" />
                                    </div>
                                    <div className="formField">
                                        <label className="fieldTitle" htmlFor="trainedStudents">
                                            Studnets Trained<span>*</span>
                                        </label>
                                        <input onChange={(e) => setOurDetails({ ...ourDetails, trainedstudents: parseInt(e.target.value) })} id="trainedStudents" value={ourDetails?.trainedstudents} type="number" placeholder="Enter No. of Trained students" />
                                    </div>
                                    <div className="formField">
                                        <label className="fieldTitle" htmlFor="placedStudents">
                                            Students Placed<span>*</span>
                                        </label>
                                        <input onChange={(e) => setOurDetails({ ...ourDetails, placedstudents: parseInt(e.target.value) })} id="placedStudents" value={ourDetails?.placedstudents} type="number" placeholder="Enter No. of Placed students" />
                                    </div>
                                </div>
                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button className='submit' onClick={updateOurDetails}>
                                    Update <ion-icon name="arrow-forward"></ion-icon>
                                </button>
                            </form>
                        </div>
                }
            </div>
        </div>
    )
}

export default AdminGlance