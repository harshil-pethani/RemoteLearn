import React, { useContext, useEffect, useState } from 'react';
import { planContext } from '../App';
import PlanService from './PlanService';


const AllPlansService = ({ setCourseConfirmPopupActive, setNotifyMePopupActive }) => {
    const { allCourses } = useContext(planContext);

    const [runningCourses, setRunningCourses] = useState([]);

    useEffect(() => {
        setRunningCourses(allCourses);
    }, []);

    const filterCourses = (e) => {
        setRunningCourses(allCourses.filter(function (course) {
            return course.title.toLowerCase().includes(e.target.value);
        }))
    }

    return (
        <>
            <div className="allplans">
                <div className="searchBar">
                    <div className="field">
                        <ion-icon name="search-outline"></ion-icon>
                        <input onChange={(e) => filterCourses(e)} placeholder="Search Course... " type="text" />
                    </div>
                </div>
                {
                    runningCourses.length > 0 &&
                    runningCourses?.map((courseDetail, index) => {
                        return (
                            <PlanService
                                setCourseConfirmPopupActive={setCourseConfirmPopupActive}
                                setNotifyMePopupActive={setNotifyMePopupActive}
                                key={index}
                                courseIndex={index}
                                curCourse={courseDetail}
                            />
                        )
                    })
                }
            </div>
        </>
    )
}

export default AllPlansService;