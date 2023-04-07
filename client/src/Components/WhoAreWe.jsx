import React from 'react'
import combineImg from "../Assets/whoarewe.png"
import whoarewe from "../Assets/whoarewewatermark.png";
import whoareweMobile from "../Assets/whoAreWeMobile.png";
// import combine from "../Assets/combine.png"
import { useNavigate } from 'react-router-dom';

const WhoAreWe = () => {
    const navigate = useNavigate();
    return (
        <div className="whoAreWe">
            <div className="whoareweBgFont">
                <img loading="lazy" src={whoarewe} alt="" />
            </div>
            <div className="whoareweBgFontMobile">
                <img loading="lazy" src={whoareweMobile} alt="" />
            </div>
            <div className="left">
                <div className="imgbox">
                    <img loading="lazy" className="img1" src={combineImg} alt="" />
                </div>
            </div>
            <div className="right">
                <h2 className="title">
                    Who Are We
                </h2>
                <div className="desc">
                    <p>
                        Remote Learn is a reputed training institute in Surat for web design, Mobile App Development, Video Editing & All types of IT Courses with result-oriented training experience. We stepped in the market in 2020 with the goal to help students, working professionals and other interested candidates get that dream job or open that desired freelance business in some of the most popular Computer / IT fields.
                    </p>
                    <p>
                        Our aim is to ease the hiring process for businesses and organizations by providing work-ready professionals who can contribute greatly to their success. Since then, we have worked hard to achieve this goal and dedicated our time and resources to train students extensively.
                    </p>
                </div>

                <button onClick={() => { navigate("/about") }} className="learnmore">
                    Learn More <ion-icon name="arrow-forward"></ion-icon>
                </button>
            </div>

        </div>
    )
}

export default WhoAreWe