import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { getGlanceApi } from '../Config/Api';

const Highlight = () => {
    const [ourDetails, setOurDetails] = useState({ teachers: "", trainedstudents: "", runningcourses: "" });

    useEffect(() => {
        const getGlance = async () => {
            try {
                const res = await axios.get(getGlanceApi);
                if (res.status === 200) {
                    setOurDetails({
                        teachers: res.data.teachers,
                        trainedstudents: res.data.students,
                        runningcourses: res.data.courses
                    });
                }
            } catch (e) {
                console.log(e);
            }
        }
        getGlance();
    }, []);

    return (
        <div className="highLight">
            <div className="container">
                <div className="line1 line"></div>
                <div className="line2 line"></div>
                <div className="line3 line"></div>
                <div className="details">
                    <div className="detailItem">
                        <h2>
                            {ourDetails.teachers || 20}+
                        </h2>
                        <h3>
                            CERTIFIED
                            TEACHERS
                        </h3>
                    </div>
                    <div className="detailItem">
                        <h2>
                            {ourDetails.trainedstudents || 345}+
                        </h2>
                        <h3>
                            Students
                            Trained
                        </h3>
                    </div>
                    <div className="detailItem">
                        <h2>
                            {ourDetails.runningcourses || 228}+
                        </h2>
                        <h3>
                            RUNNING
                            COURSES
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Highlight