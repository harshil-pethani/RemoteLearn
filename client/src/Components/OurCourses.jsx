import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import uiux from "../Assets/uiux.png";
import frontend from "../Assets/frontend.png";
import php from "../Assets/php.png";
import android from "../Assets/android.png";
import ios from "../Assets/ios.png";
import fullstack from "../Assets/fullstack.png";
import ourcourseswatermark from "../Assets/ourcourseswatermark.png"
import { planContext } from '../App';

const OurCourses = () => {
    const { allCourses } = useContext(planContext);

    return (
        <div className="ourCourses">
            <h2 className="title">
                Our Courses
            </h2>
            <div className="backgroundFont">
                <img loading="lazy" src={ourcourseswatermark} alt="" />
            </div>
            <div className="cardContainer">
                {
                    allCourses.map((course, i) => {
                        return (
                            <div key={i} className="card">
                                <img src={
                                    course.title.toLowerCase().includes("graphic") ? uiux :
                                        course.title.toLowerCase().includes("frontend") ? frontend :
                                            course.title.toLowerCase().includes("php") ? php :
                                                course.title.toLowerCase().includes("android") ? android :
                                                    course.title.toLowerCase().includes("ios") ? ios :
                                                        course.title.toLowerCase().includes("full stack") ? fullstack : fullstack
                                } alt="courseImg" />
                                <p className="courseTitle">
                                    {course.title}
                                </p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default OurCourses;