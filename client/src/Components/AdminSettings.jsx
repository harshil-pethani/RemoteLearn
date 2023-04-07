import axios from 'axios'
import React, { useEffect, useState } from 'react'
import AdminSide from '../Components/AdminSide'
import AdminTop from '../Components/AdminTop'
import { deleteFacultyApi, getAllAdminApi, registerApi, updateAdminDataApi, updatepasswordApi } from '../Config/Api'
import Loader from './Loader'

const AdminSettings = ({ adminDetails, setAdminDetails, setAdminLogged }) => {
    const [passwordData, setPasswordData] = useState({ curPassword: "", newPassword: "", retypePassword: "" })
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [resMsg, setResMsg] = useState("");
    const [isError2, setIsError2] = useState(false);
    const [resMsg2, setResMsg2] = useState("");
    const [isError3, setIsError3] = useState(false);
    const [resMsg3, setResMsg3] = useState("");
    const [renderPage, setRenderPage] = useState(1);

    const [adminsData, setAdminsData] = useState([]);


    const [addFacultyPopup, setAddFacultyPopup] = useState(false);

    const [newFaculty, setNewFaculty] = useState({ name: "", email: "", password: "", usertype: "faculty" });

    const [isReqProcessing, setIsReqProcessing] = useState(false);
    const [isError4, setIsError4] = useState(false);
    const [resMsg4, setResMsg4] = useState("");


    const validateData = () => {
        if (!adminDetails.username || !adminDetails.email) {
            setIsError(true);
            setResMsg("Please fill out all the Fields ");
            return false;
        } else if (adminDetails.username.length < 5) {
            setIsError(true);
            setResMsg("Please Enter Valid Username (Minimum 5 characters)");
            return false;
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(adminDetails.email))) {
            setIsError(true);
            setResMsg("Please Enter Valid Email Address");
            return false;
        }
        setIsError(false);
        setResMsg("");
        return true;
    }

    const validateData2 = () => {
        if (!passwordData.curPassword || !passwordData.newPassword || !passwordData.retypePassword) {
            setIsError2(true);
            setResMsg2("Please fill out all the Fields ");
            return false;
        } else if (passwordData.newPassword.length < 6) {
            setIsError2(true);
            setResMsg2("Password length is short (Minimum 6 characters required)");
            return false;
        } else if (passwordData.newPassword !== passwordData.retypePassword) {
            setIsError2(true);
            setResMsg2("New password and retype new password must be same");
            return false;
        }
        setIsError2(false);
        setResMsg2("");
        return true;
    }

    const updateAdminData = async (e) => {
        e.preventDefault();
        if (validateData()) {
            try {
                setIsLoading(true);
                const res = await axios.post(updateAdminDataApi, adminDetails, { withCredentials: true });
                if (res.status === 200) {
                    setIsLoading(false);
                    setIsError(false);
                    // setResMsg(res.data);
                    setAdminDetails(res.data);
                    setResMsg("Admin details Updated successfully")
                }
            } catch (e) {
                setIsError(true);
                setIsLoading(false);
                if (e.response.status === 400) {
                    setResMsg(e.response.data);
                } else if (e.response.status === 409) {
                    setResMsg(e.response.data);
                } else if (e.response.status === 500) {
                    setResMsg(e.response.data);
                } else {
                    setResMsg("Sorry, Something went wrong - Please try after some time.");
                }
                // console.log(e);
            }
        }
    }

    const updatePassword = async (e) => {
        e.preventDefault();
        if (validateData2()) {
            try {
                setIsLoading(true);
                const res = await axios.post(updatepasswordApi, passwordData, { withCredentials: true });

                if (res.status === 200) {
                    setIsError2(false);
                    setPasswordData({ curPassword: "", newPassword: "", retypePassword: "" })
                    setIsLoading(false);
                    setResMsg2("Password Updated Successfully");
                }
            } catch (e) {
                setIsError2(true);
                setIsLoading(false);
                if (e.response.status === 400) {
                    setResMsg2(e.response.data);
                } else if (e.response.status === 500) {
                    setResMsg2(e.response.data);
                } else {
                    setResMsg2("Sorry, Something went wrong - Please try after some time.");
                }
                // console.log(e);
            }
        }
    }

    useEffect(() => {
        const getAllAdmins = async () => {
            try {
                const res = await axios.get(getAllAdminApi, { withCredentials: true });
                if (res.status === 200) {
                    setIsLoading(false);
                    setAdminsData(res.data);
                    setIsError3(false);
                    setResMsg3("");
                }
            } catch (e) {
                setIsLoading(false);
                // console.log(e);
                setAdminsData([]);
                setIsError3(true);
                setResMsg3("Other Admins Details Fetching failed");
            }
        }
        if (adminDetails.usertype === "owner") {
            setIsLoading(true);
            getAllAdmins();
        }
    }, [renderPage]);

    const addFaculty = async (e) => {
        // console.log(e)
        e.preventDefault();
        if (!newFaculty.name || !newFaculty.email || !newFaculty.password || !newFaculty) {
            setIsError4(true);
            setResMsg4("Please fill out all the fields")
            return;
        } else if (newFaculty.name.length < 3) {
            setIsError4(true);
            setResMsg4("Username should be more than 3 characters");
            return false;
        } else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(newFaculty.email))) {
            setIsError4(true);
            setResMsg4("Please Enter Valid Email Address");
            return false;
        } else if (newFaculty.password.length < 6) {
            setIsError4(true);
            setResMsg4("Password should be asleast 6 characters");
            return false;
        }

        try {
            setIsReqProcessing(true);
            const res = await axios.post(registerApi, { email: newFaculty.email, password: newFaculty.password, usertype: newFaculty.usertype, username: newFaculty.name }, { withCredentials: true });
            if (res.status === 200) {
                setIsReqProcessing(false);
                setIsError4(false);
                setResMsg4("Faculty registration successful");
                setRenderPage(renderPage + 1);
                setNewFaculty({ name: "", email: "", password: "", usertype: "faculty" })
            }
        } catch (e) {
            setIsReqProcessing(false);
            if (e.response.status === 400) {
                setIsError4(true);
                setResMsg4(e.response.data);
            } else if (e.response.status === 500) {
                setIsError4(true);
                setResMsg4(e.response.data);
            } else {
                setIsError4(true);
                setResMsg4("Sorry, Something went wrong - Please try after some time.");
            }
        }
    }

    const removeUser = async (adminId) => {
        if (window.confirm("Are you sure to Remove this Faculty ? ")) {
            try {
                setIsLoading(true);
                const res = await axios.delete(deleteFacultyApi(adminId), { withCredentials: true })

                if (res.status === 200) {
                    setIsError3(false);
                    setResMsg3("");
                    setRenderPage(renderPage + 1);
                }

            } catch (e) {
                setIsLoading(false);
                setIsError3(true);
                console.log(e);
                setResMsg3("Admin Status Update Failed");
            }
        }
    }

    return (
        <div>
            {
                addFacultyPopup &&
                (
                    <div className="mailPopUpLayer addFaculty">
                        {

                            <div className="popUpBox">
                                <ion-icon onClick={() => setAddFacultyPopup(false)} name="close-circle-outline"></ion-icon>

                                <h2 className="popuptitle">
                                    Add New Faculty
                                </h2>
                                <form autoComplete="off" action="">
                                    <label htmlFor="name">
                                        Name<span>*</span>
                                    </label>
                                    <input autoComplete='new-name' name='facultyname' value={newFaculty.name} id="name" onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })} type="text" />

                                    <label htmlFor="email">
                                        Email<span>*</span>
                                    </label>
                                    <input autoComplete='new-email' name='facultyEmail' value={newFaculty.email} id="email" onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value.toLowerCase() })} type="email" />

                                    <label htmlFor="password">
                                        Password<span>*</span>
                                    </label>
                                    <input autoComplete='new-password' name='facultyPass' value={newFaculty.password} id="password" onChange={(e) => setNewFaculty({ ...newFaculty, password: e.target.value })} type="password" />

                                    <label htmlFor="usertype">
                                        User Type<span>*</span>
                                    </label>
                                    <select name="usertype" id="usertype" onChange={(e) => setNewFaculty({ ...newFaculty, usertype: e.target.value })}>
                                        <option value="faculty">Faculty</option>
                                        <option value="owner">Owner</option>
                                    </select>

                                    {
                                        <p className={isError4 ? "resMsg error" : "resMsg"}>
                                            {resMsg4}
                                        </p>
                                    }

                                    <button disabled={isReqProcessing} onClick={addFaculty} type="submit">
                                        Submit
                                    </button>
                                </form>
                            </div>
                        }
                    </div>
                )
            }
            <AdminTop adminDetails={adminDetails} />
            <div className="adminMainContent">
                <AdminSide adminDetails={adminDetails} setAdminLogged={setAdminLogged} />
                {
                    isLoading ?
                        <Loader adminLoader={true} /> :
                        <div className="right adminSettings">
                            <h2 className="title">
                                Settings
                            </h2>
                            <form className='form'>
                                <div className="fields">
                                    <div className="formField">
                                        <div className="dateBox">
                                            <div className="subFormField">
                                                <label className="fieldTitle" htmlFor="username">
                                                    Update Username<span>*</span>
                                                </label>
                                                <input onChange={(e) => setAdminDetails({ ...adminDetails, username: e.target.value })} id="username" value={adminDetails?.username} type="text" placeholder="Enter your Username" />
                                            </div>
                                            <div className="subFormField">
                                                <label className="fieldTitle" htmlFor="email">
                                                    Update Email<span>*</span>
                                                </label>
                                                <input onChange={(e) => setAdminDetails({ ...adminDetails, email: e.target.value.toLowerCase() })} id="email" value={adminDetails?.email} type="text" placeholder="Enter your Email" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className={isError ? "resMsg error" : "resMsg"}>
                                    {resMsg}
                                </p>
                                <button className='submit' onClick={updateAdminData}>
                                    Update Data <ion-icon name="arrow-forward"></ion-icon>
                                </button>
                            </form>

                            <form className="form2">
                                <label className="fieldTitle">
                                    Update Password
                                </label>
                                <div className="formField">
                                    <div className="dateBox">
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="curPassword">
                                                Current Password<span>*</span>
                                            </label>
                                            <input id="curPassword" value={passwordData.curPassword} onChange={(e) => setPasswordData({ ...passwordData, curPassword: e.target.value })} type="password" placeholder="Enter Current Password" />
                                        </div>
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="newPassword">
                                                New Password<span>*</span>
                                            </label>
                                            <input id='newPassword' value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} type="password" placeholder="Enter New Password" />
                                        </div>
                                        <div className="subFormField">
                                            <label className="fieldTitle" htmlFor="renewPassword">
                                                Re-enter New Password<span>*</span>
                                            </label>
                                            <input id='renewPassword' value={passwordData.retypePassword} onChange={(e) => setPasswordData({ ...passwordData, retypePassword: e.target.value })} type="password" placeholder="Confirm New Password" />
                                        </div>
                                    </div>
                                </div>
                                <p className={isError2 ? "resMsg error" : "resMsg"}>
                                    {resMsg2}
                                </p>
                                <button className="submit" onClick={updatePassword}>
                                    Update Password <ion-icon name="arrow-forward"></ion-icon>
                                </button>
                            </form>
                            {

                                adminDetails.usertype === "owner" &&
                                <>
                                    <div className="topFacultyBar">
                                        <h2 className="title">
                                            Faculty Details
                                        </h2>
                                        <button onClick={() => { setResMsg4(""); setAddFacultyPopup(true) }} className="addFaculty">
                                            Add Faculty <ion-icon name="arrow-forward"></ion-icon>
                                        </button>
                                    </div>

                                    <p className="errMsg">
                                        {isError3 && resMsg3}
                                    </p>
                                    <div className="tableDiv" style={{ overflow: "auto" }}>
                                        {
                                            adminsData.length > 0 ?
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Username</th>
                                                            <th>Email</th>
                                                            <th>Usertype</th>
                                                            <th>Remove</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            adminsData?.map((adminData, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {adminData.username}
                                                                    </td>
                                                                    <td>
                                                                        {adminData.email}
                                                                    </td>
                                                                    <td>
                                                                        {adminData.usertype}
                                                                    </td>
                                                                    <td>
                                                                        <button onClick={() => removeUser(adminData._id)}>
                                                                            Remove
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        }

                                                    </tbody>

                                                </table>
                                                :
                                                <p className="noData">
                                                    No Faculties found
                                                </p>
                                        }
                                    </div>
                                </>

                            }
                        </div>
                }
            </div>
        </div >
    )
}

export default AdminSettings    