import axios from 'axios';
import React, { useEffect, useState } from 'react'
import deleteBtn from "../Assets/deleteBtn.png";
import { deleteCustomerApi, getAllCustomersApi, getAllNotificationApi } from '../Config/Api';
import AdminSide from './AdminSide'
import AdminTop from './AdminTop'
import Loader from './Loader';
import { ExportJsonCsv } from 'react-export-json-csv';

const AdminWaiting = ({ adminDetails, setAdminLogged }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [waitingData, setWaitingData] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);

    const [titleSelects, setTitleSelects] = useState([]);
    const [slotSelects, setSlotSelects] = useState([]);

    const [csvData, setCsvData] = useState([]);

    const headers = [
        {
            key: 'id',
            name: 'ID',
        },
        {
            key: 'coursename',
            name: 'Course Name',
        },
        {
            key: 'batchname',
            name: 'Batch Name',
        },
        {
            key: 'useremail',
            name: 'Student Email',
        },
    ]

    useEffect(() => {
        const size = filteredStudents.length;
        let tempData = [];

        for (let i = 0; i < size; i++) {
            tempData.push({ id: i, coursename: filteredStudents[i].coursename, useremail: filteredStudents[i].useremail, batchname: filteredStudents[i].batchname })
        }
        setCsvData(tempData);
    }, [filteredStudents]);

    const [dropDownActive, setDropDownActive] = useState("");
    const [filters, setFilters] = useState({ titleFilter: "All Courses", slotFilter: "All Batches" });

    useEffect(() => {
        const getNotifies = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(getAllNotificationApi, { withCredentials: true });
                if (res.status === 200) {
                    setIsLoading(false);
                    setWaitingData(res.data.reverse());
                }
            } catch (e) {
                setIsLoading(false);
                // console.log(e);
            }
        }
        getNotifies();
    }, []);

    useEffect(() => {
        setFilteredStudents(waitingData);
        const courseNames = new Set(waitingData.map((student) => student.coursename));
        const courseBatches = new Set(waitingData.map((student) => student.batchname));
        setTitleSelects(["All Courses", ...courseNames]);
        setSlotSelects(["All Batches", ...courseBatches]);
    }, [waitingData]);

    const handleFilter = (name, value) => {
        setFilters({
            ...filters,
            [name]: value
        })
    }

    useEffect(() => {
        setFilteredStudents(
            waitingData.filter((student) =>
                Object.entries(filters).every(([key, value]) => {
                    if (key === "titleFilter" && value !== "All Courses")
                        return student.coursename === value;
                    else if (key === "slotFilter" && value !== "All Batches")
                        return student.batchname === value;
                    else
                        return true;
                })
            )
        )
    }, [filters])

    return (
        <div>
            <AdminTop adminDetails={adminDetails} />
            <div className="adminMainContent">
                <AdminSide adminDetails={adminDetails} setAdminLogged={setAdminLogged} />
                {
                    isLoading ?
                        <Loader adminLoader={true} /> :
                        <div className="adminStudents right">
                            <h2 className="title">
                                Waiting Students
                            </h2>
                            <div className="filterContainer">
                                {
                                    waitingData.length > 0 &&
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
                                                                    // setTitleAns(curSelect);
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
                                            <div onClick={() => { (dropDownActive === "slotDropdown") ? setDropDownActive("") : setDropDownActive("slotDropdown") }} className="dropDown-Btn">
                                                {filters.slotFilter}
                                                <ion-icon name="caret-down-outline"></ion-icon>
                                            </div>
                                            {
                                                (dropDownActive === "slotDropdown") &&
                                                <div className="dropDown-content">
                                                    {
                                                        slotSelects.map((curSelect, index) => {
                                                            return (
                                                                <div key={"select" + index} onClick={() => {
                                                                    // setSlotAns(curSelect);
                                                                    handleFilter("slotFilter", curSelect);
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
                                {
                                    filteredStudents.length > 0 &&
                                    <ExportJsonCsv className="exportBtn" headers={headers} items={csvData}>Export</ExportJsonCsv>
                                }
                            </div>

                            <div className="tableDiv" style={{ overflow: "auto" }}>
                                {
                                    filteredStudents.length > 0 ?
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Course Name</th>
                                                    <th>Batch Name</th>
                                                    <th>User Email</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    filteredStudents?.map((student, index) => (
                                                        <tr key={index}>
                                                            <td className="bannerText">
                                                                {student.coursename}
                                                            </td>
                                                            <td>
                                                                {student.batchname}
                                                            </td>
                                                            <td>
                                                                {student.useremail.toLowerCase()}
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                        :
                                        <p className="noData">
                                            No Students has Scheduled Batch Notification
                                        </p>
                                }
                            </div>
                        </div>
                }
            </div>
        </div >
    )
}

export default AdminWaiting