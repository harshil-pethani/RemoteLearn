import React from 'react';
import whyChoose from '../Assets/whychoosewatermark.png';
import lifetimesupport from "../Assets/lifetimesupport.png";
import latestcurriculum from '../Assets/latestcurriculum.png';
import interviewassistance from '../Assets/interviewassistance.png';
import industryexpert from '../Assets/industryexpert.png';

const WhyChoose = () => {
    return (
        <div className='whyChoose'>
            <h2 className="title">
                WHY CHOOSE Remote Learn
            </h2>
            <div className="backgroundFont">
                <img loading="lazy" src={whyChoose} alt="" />
            </div>
            <div className="cardContainer">
                <div className="card">
                    <img src={industryexpert} alt="courseImg" />
                    <h2 className="cardTitle">
                        Industry Experts As Trainers
                    </h2>
                    <p className="courseTitle">
                        Our trainers have 5+ years of industry experience coupled with extensive research and analysis.
                    </p>
                </div>
                <div className="card">
                    <img src={latestcurriculum} alt="courseImg" />
                    <h2 className="cardTitle">
                        Latest Curriculum
                    </h2>
                    <p className="courseTitle">
                        We Provides latest curriculum  such that Students will get full knowledge of latest technologies.
                    </p>
                </div>
                <div className="card">
                    <img src={interviewassistance} alt="courseImg" />
                    <h2 className="cardTitle">
                        Interview Assistance
                    </h2>
                    <p className="courseTitle">
                        At the end of each training,our instructor will go through the technical questions.
                    </p>
                </div>
                <div className="card">
                    <img src={lifetimesupport} alt="courseImg" />
                    <h2 className="cardTitle">
                        Lifetime Support
                    </h2>
                    <p className="courseTitle">
                        We will provide you lifetime support on all the courses you learned from us.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default WhyChoose