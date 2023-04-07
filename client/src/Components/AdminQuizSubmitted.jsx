import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import deleteBtn from "../Assets/deleteBtn.png";
import { deleteSingleQuizApi, getQuizListApi } from '../Config/Api';
import AdminSide from './AdminSide'
import AdminTop from './AdminTop'
import Loader from './Loader';

const QuizSubmitted = ({ adminDetails, setAdminLogged }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [quizListData, setQuizListData] = useState([]);
    const [renderPage, setRenderPage] = useState(1);

    const navigate = useNavigate();

    const deleteQuizData = async (studentId) => {
        if (window.confirm("Are you sure you want to remove this student data?")) {
            try {
                setIsLoading(true);
                const res = await axios.delete(deleteSingleQuizApi(studentId), { withCredentials: true })
                if (res.status === 200) {
                    setRenderPage(renderPage + 1);
                    setIsLoading(false);
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        }
    }


    useEffect(() => {
        const getQuizList = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(getQuizListApi, { withCredentials: true });
                if (res.status === 200) {
                    setIsLoading(false);
                    setQuizListData(res.data.reverse());
                }
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
        }
        getQuizList();
    }, [renderPage]);


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
                                Consulting Students
                            </h2>

                            <div className="tableDiv" style={{ overflow: "auto" }}>
                                {
                                    quizListData.length > 0 ?
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Username</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>View</th>
                                                    <th>Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    quizListData?.map((student, index) => (
                                                        <tr key={index}>
                                                            <td className="bannerText">
                                                                {student.username}
                                                            </td>
                                                            <td>
                                                                {student.email.toLowerCase()}
                                                            </td>
                                                            <td>
                                                                {student.phone}
                                                            </td>
                                                            <td className='view'>
                                                                <button onClick={() => navigate(`/admin/quizsubmitted/${student._id}`)}>
                                                                    <ion-icon name="eye-outline"></ion-icon>
                                                                </button>
                                                            </td>
                                                            <td className="end">
                                                                <button onClick={() => deleteQuizData(student._id)}>
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
        </div >
    )
}

export default QuizSubmitted