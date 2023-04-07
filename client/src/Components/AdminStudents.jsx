import axios from 'axios';
import React, { useEffect, useState } from 'react'
import deleteBtn from "../Assets/deleteBtn.png";
import { deleteStudentApi, getAllStudentApi, sendBulkMailApi } from '../Config/Api';
import AdminSide from './AdminSide'
import AdminTop from './AdminTop'
import Loader from './Loader';
import { ExportJsonCsv } from 'react-export-json-csv';
import { useNavigate } from 'react-router-dom';

const AdminStudents = ({ adminDetails, setAdminLogged }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [customerData, setCustomerData] = useState([]);
    const [filteredCustomer, setFilteredCustomer] = useState([]);

    const [titleSelects, setTitleSelects] = useState([]);
    const [batchSelects, setBatchSelects] = useState([]);
    const navigate = useNavigate();


    const [renderPage, setRenderPage] = useState(1);

    const [csvData, setCsvData] = useState([]);


    const [emailData, setEmailData] = useState("");
    const [mailContent, setMailContent] = useState("");
    const [mailSubject, setMailSubject] = useState("");
    const [mailTitle, setMailTitle] = useState("");
    const [errMsg, setErrMsg] = useState("");

    const [sendMailPopupActive, setSendMailPopupActive] = useState(false);
    const [mailSentSuccess, setMailSentSuccess] = useState(false);
    const [isReqProcessing, setIsReqProcessing] = useState(false);

    const headers = [
        {
            key: 'id',
            name: 'ID',
        },
        {
            key: 'username',
            name: 'Username',
        },
        {
            key: 'email',
            name: 'Email',
        },
        {
            key: 'coursename',
            name: 'Course Name',
        },
        {
            key: 'batch',
            name: 'Course Batch',
        }
    ]

    useEffect(() => {
        const size = filteredCustomer.length;
        let tempData = [];
        let tempEmailData = "";

        for (let i = 0; i < size; i++) {
            tempData.push({ id: i, username: filteredCustomer[i].username, email: filteredCustomer[i].email, coursename: filteredCustomer[i].coursename, batch: filteredCustomer[i].batch })
            tempEmailData += `${filteredCustomer[i].email};`;
        }
        setCsvData(tempData);
        setEmailData(tempEmailData);
    }, [filteredCustomer]);

    const [dropDownActive, setDropDownActive] = useState("");
    const [filters, setFilters] = useState({ titleFilter: "All Courses", batchFilter: "All Batches" });

    useEffect(() => {
        const getStudents = async () => {
            try {
                setIsLoading(true);
                const allCustomers = await axios.get(getAllStudentApi, { withCredentials: true });
                if (allCustomers.status === 200) {
                    setIsLoading(false);
                    setCustomerData(allCustomers.data.reverse());
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        }
        getStudents();
    }, [renderPage]);

    useEffect(() => {
        setFilteredCustomer(customerData);
        const courseTitles = new Set(customerData.map((student) => student.coursename));
        const courseBatches = new Set(customerData.map((student) => student.batch));
        setTitleSelects(["All Courses", ...courseTitles]);
        setBatchSelects(["All Batches", ...courseBatches]);
    }, [customerData]);

    const deleteStudent = async (custid) => {
        if (window.confirm("Are you sure you want to remove this customer?")) {
            try {
                setIsLoading(true);
                const res = await axios.delete(deleteStudentApi(custid), { withCredentials: true })
                if (res.status === 200) {
                    setIsLoading(false);
                    setRenderPage(renderPage + 1);
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        }
    }

    const handleFilter = (name, value) => {
        setFilters({
            ...filters,
            [name]: value
        })
    }

    useEffect(() => {
        setFilteredCustomer(
            customerData.filter((customer) =>
                Object.entries(filters).every(([key, value]) => {
                    if (key === "titleFilter" && value !== "All Courses")
                        return customer.coursename === value;
                    else if (key === "batchFilter" && value !== "All Batches")
                        return customer.batch === value;
                    else
                        return true;
                })
            )
        )
    }, [filters]);


    const sendMail = async (e) => {
        e.preventDefault();

        if (!emailData || !mailContent || !mailTitle || !mailSubject) {
            setErrMsg("Please fill out all the fields")
            return;
        } else if (mailContent.length < 10) {
            setErrMsg("Mail Content should be more than 10 characters.");
            return false;
        } else {
            emailData.split(';').forEach(mailId => {
                if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mailId))) {
                    setErrMsg("Please Enter Valid Email Address");
                    return false;
                }
            });
        }
        setErrMsg("");


        try {
            setIsReqProcessing(true);
            const res = await axios.post(sendBulkMailApi, { emailData: emailData.split(';'), mailContent: mailContent, mailSubject: mailSubject, mailTitle: mailTitle }, { withCredentials: true });
            if (res.status === 200) {
                setIsReqProcessing(false);
                setMailSentSuccess(true);
            }
        } catch (e) {
            setIsReqProcessing(false);
            if (e.response.status === 400) {
                setErrMsg(e.response.data);
            } else if (e.response.status === 500) {
                setErrMsg(e.response.data);
            } else {
                setErrMsg("Sorry, Something went wrong - Please try after some time.");
            }
        }
    }

    return (
        <div className="enrolledStudentPage">
            {
                sendMailPopupActive &&
                (
                    <div className="mailPopUpLayer">
                        {
                            !mailSentSuccess ?
                                <div className="popUpBox">
                                    <ion-icon onClick={() => setSendMailPopupActive(false)} name="close-circle-outline"></ion-icon>
                                    <form>
                                        <h2 className="popuptitle">
                                            Enter Mail Details
                                        </h2>
                                        <label htmlFor="emails">
                                            Email Addresses of Students<span>*</span>
                                        </label>
                                        <textarea className='emails' value={emailData} id="emails" onChange={(e) => setEmailData(e.target.value)} type="text" />


                                        <label htmlFor="mailTitle">
                                            Mail Title<span>*</span>
                                        </label>
                                        <input value={mailTitle} id="mailTitle" onChange={(e) => setMailTitle(e.target.value)} type="text" />

                                        <label htmlFor="mailSubject">
                                            Mail Title<span>*</span>
                                        </label>
                                        <input value={mailSubject} id="mailSubject" onChange={(e) => setMailSubject(e.target.value)} type="text" />

                                        <label htmlFor="mailContent">
                                            Mail Content<span>*</span>
                                        </label>
                                        <textarea value={mailContent} id="mailContent" onChange={(e) => setMailContent(e.target.value)} type="text" />

                                        <p className="errMsg">
                                            {errMsg}
                                        </p>
                                        <button disabled={isReqProcessing} onClick={sendMail} type="submit">
                                            Send
                                        </button>
                                    </form>
                                </div>
                                :
                                <div className="mailSentPopUpBox popUpBox">
                                    <h2 className="popuptitle">
                                        YOR’RE ALL SET
                                    </h2>
                                    <p className="popupsubtitle">
                                        Email has been sent to all the Students, which you have mentioned.
                                    </p>
                                    <button onClick={
                                        () => {
                                            setSendMailPopupActive(false);
                                            navigate("/admin/students")
                                        }
                                    }>
                                        Continue Exploring
                                    </button>
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
                        <div className="adminStudents right">
                            <h2 className="title">
                                Enrolled Students
                            </h2>
                            <div className="filterContainer">
                                {
                                    customerData.length > 0 &&
                                    <div className="filter">
                                        <span className="filterText">
                                            Filter Students :
                                        </span>
                                        <div className="dropDown">
                                            <div onClick={() => { (dropDownActive === "titleDropdown") ? setDropDownActive("") : setDropDownActive("titleDropdown") }} className="dropDown-Btn">
                                                {filters.titleFilter}
                                                <ion-icon name="caret-down-outline"></ion-icon>
                                            </div>
                                            {
                                                (dropDownActive === "titleDropdown") &&
                                                <div className="dropDown-content">
                                                    {
                                                        titleSelects.map((curSelect, index) => {
                                                            return (
                                                                <div key={"select" + index} onClick={() => {
                                                                    handleFilter("titleFilter", curSelect);
                                                                    setDropDownActive("");
                                                                }} className="dropDown-item">
                                                                    {curSelect}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }
                                        </div>
                                        <div className="dropDown">
                                            <div onClick={() => { (dropDownActive === "batchDropdown") ? setDropDownActive("") : setDropDownActive("batchDropdown") }} className="dropDown-Btn">
                                                {filters.batchFilter}
                                                <ion-icon name="caret-down-outline"></ion-icon>
                                            </div>
                                            {
                                                (dropDownActive === "batchDropdown") &&
                                                <div className="dropDown-content">
                                                    {
                                                        batchSelects.map((curSelect, index) => {
                                                            return (
                                                                <div key={"select" + index} onClick={() => {
                                                                    handleFilter("batchFilter", curSelect);
                                                                    setDropDownActive("");
                                                                }} className="dropDown-item">
                                                                    {curSelect}
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            }
                                        </div>
                                    </div>
                                }
                                <div className="btns">
                                    {
                                        customerData.length > 0 &&
                                        <button className="exportBtn" onClick={() => setSendMailPopupActive(true)}>
                                            Send Email
                                        </button>
                                    }
                                    {
                                        filteredCustomer.length > 0 &&
                                        <ExportJsonCsv className="exportBtn" headers={headers} items={csvData}>Export</ExportJsonCsv>
                                    }
                                </div>
                            </div>

                            <div className="tableDiv" style={{ overflow: "auto" }}>
                                {
                                    filteredCustomer.length > 0 ?
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Username</th>
                                                    <th>Email</th>
                                                    <th>Course Title</th>
                                                    <th>Course Batch</th>
                                                    <th>Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filteredCustomer?.map((customer, index) => (
                                                        <tr key={index}>
                                                            <td className="bannerText">
                                                                {customer.username}
                                                            </td>
                                                            <td>
                                                                {customer.email.toLowerCase()}
                                                            </td>
                                                            <td>
                                                                {customer.coursename}
                                                            </td>
                                                            <td>
                                                                {customer.batch}
                                                            </td>
                                                            <td className="end">
                                                                <button onClick={() => deleteStudent(customer._id)}>
                                                                    <img src={deleteBtn} alt="" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        :
                                        <p className="noData">
                                            No Student Data Available
                                        </p>
                                }
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default AdminStudents