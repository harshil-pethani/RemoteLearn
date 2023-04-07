import React from 'react'
import ceo from "../Assets/ceo.png";
import ceo2 from "../Assets/ceo2.png";
import cmo from "../Assets/cmo.png";
import ceowatermark from "../Assets/ceowatermark.png";
import cmowatermark from "../Assets/cmowatermark.png";

const Trainers = () => {
    return (
        <div className="trainers">
            <h2 className="title">
                OUR TEAM
            </h2>
            <div className="trainerDetail">
                <div className="left">
                    <div className="imgbox">
                        <img loading="lazy" className="trainer" src={ceo} alt="" />
                    </div>
                </div>
                <div className="right">
                    <h2 className="title">
                        Yogendra Singh
                    </h2>
                    <div className="desc">
                        <p>
                            Yogendra singh has a background in the corporate job as well as freelancer worlds and he is able to incorporate that into his work with the Remote Learn community! He is graduated from Nirma University, Ahmedabad. Than he started one corporate job and paralleled he also working as a freelancer.  Than He started his own company to help the students who wants to learns the IT domains and IT employees who wants to change their domain. His goal is to share the knowledge anywhere in the world through the virtual program!
                        </p>
                    </div>

                    <a href="https://youtu.be/ZkF7B4ZIM_o" target="_blank" rel="noreferrer" className="btn learnmore">
                        Learn More <ion-icon name="arrow-forward"></ion-icon>
                    </a>
                </div>
                <div className="personalTrainerFont">
                    <img loading="lazy" src={ceowatermark} alt="" />
                </div>
            </div>
            <div className="trainerDetail">
                <div className="left">
                    <div className="imgbox">
                        <img loading="lazy" className="trainer" src={ceo2} alt="" />
                    </div>
                </div>
                <div className="right">
                    <h2 className="title">
                        PriYANKA AGGARWAL
                    </h2>
                    <div className="desc">
                        <p>
                            Yogendra singh has a background in the corporate job as well as freelancer worlds and he is able to incorporate that into his work with the Remote Learn community! He is graduated from Nirma University, Ahmedabad. Than he started one corporate job and paralleled he also working as a freelancer.  Than He started his own company to help the students who wants to learns the IT domains and IT employees who wants to change their domain. His goal is to share the knowledge anywhere in the world through the virtual program!
                        </p>
                    </div>

                    <a href='https://youtu.be/IEq9hNn41QU' target="_blank" rel="noreferrer" className="btn learnmore">
                        Learn More <ion-icon name="arrow-forward"></ion-icon>
                    </a>
                </div>
                <div className="personalTrainerFont">
                    <img loading="lazy" src={ceowatermark} alt="" />
                </div>
            </div>
            <div className="trainerDetail">
                <div className="left">
                    <div className="imgbox">
                        <img loading="lazy" className="trainer" src={cmo} alt="" />
                    </div>
                </div>
                <div className="right">
                    <h2 className="title">
                        Mehul Shah
                    </h2>
                    <div className="desc">
                        <p>
                            Yogendra singh has a background in the corporate job as well as freelancer worlds and he is able to incorporate that into his work with the Remote Learn community! He is graduated from Nirma University, Ahmedabad. Than he started one corporate job and paralleled he also working as a freelancer.  Than He started his own company to help the students who wants to learns the IT domains and IT employees who wants to change their domain. His goal is to share the knowledge anywhere in the world through the virtual program!
                        </p>
                    </div>

                    <a href='https://youtu.be/IEq9hNn41QU' target="_blank" rel="noreferrer" className="btn learnmore">
                        Learn More <ion-icon name="arrow-forward"></ion-icon>
                    </a>
                </div>
                <div className="personalTrainerFont cmo">
                    <img loading="lazy" src={cmowatermark} alt="" />
                </div>
            </div>
        </div>
    )
}

export default Trainers