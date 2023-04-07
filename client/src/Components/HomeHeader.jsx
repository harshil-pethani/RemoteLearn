import React from 'react'
import { useNavigate } from 'react-router-dom';
import backgroundFont from '../Assets/Reotelearn_watermark.png'
import heroImg from '../Assets/heroImg.png';
import Navbar from './Navbar';

const HomeHeader = () => {
    const navigate = useNavigate();
    return (
        <div className="homeHeader">
            <div className="left">
                <img src={heroImg} loading="lazy" alt="" />
            </div>
            <div className="right">
                <h2 className="slogan">
                    A virtual TRAINING program TO LEARN NEW TECHNOLOGIES WITHOUT LEAVING YOUR HOME
                </h2>
                <p className="desc">
                    Enroll now, to achieve goals of learning latest technologies without leaving your home. So all you have to do is attend sessions, Learn the Technologies and expand your career opportunities.
                </p>
                <button onClick={() => { navigate("/services") }} className="learnmore">
                    Enroll Now <ion-icon name="arrow-forward"></ion-icon>
                </button>
            </div>
            <div className="backgroundFonts">
                <img loading="lazy" src={backgroundFont} alt="" />
            </div>
        </div>
    )
}

export default HomeHeader