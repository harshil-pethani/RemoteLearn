import React, { useEffect, useRef, useState } from 'react'
import student1 from "../Assets/student1.png"
import student2 from "../Assets/student2.png"
import student3 from "../Assets/student3.png"
import student4 from "../Assets/student4.png"
import testimonialFont from "../Assets/testimonialswatermark.png";
import { Link } from "react-router-dom";

const Testimonials = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const timeoutRef = useRef(null);
    const delay = 4000;

    function resetTimeout() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setSlideIndex((prevIndex) =>
                    prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
                ),
            delay
        );

        return () => {
            resetTimeout();
        };
    }, [slideIndex]);

    const reviews = [
        {
            username: "Jay Rathod",
            image: student1,
            desc: "After completing Std. 12, I felt that I wanted to be a developer, but when I heard about this course and saw it, I felt that I should recognize my inner strength and then decide what I am made for. I had Chosen Full Stack Development and today I work as a Team Leader in a very reputed company. And 30+ Employees work in my under right now. And since the job is 8 hours, I do freelance work comfortably. So, I would like to thank Remote Learn and the mentors of the Remote Learn who had helped me lot."
        },
        {
            username: "Rajesh Rana",
            image: student2,
            desc: "I have leanrned Flutter Programming in Remote Learn, this one is best institute to learn flutter programming, Now I am working on as a Lead Developer of Flutter development team in the company. It really helped me to understand the requirements of the assignment and provided practical tips on how to approach it. I can't thank them enough for all of their support.Thank you!"
        },
        {
            username: "Kishan Rakholiya",
            image: student3,
            desc: "I have completed graphics desing course in Remote Learn. It was obvious they spent a lot of time reviewing my work and were able to provide valuable, constructive feedback. Whenever I had a question, they responded directly and within a day. Remote Learn is an excellent place,where we can growth our life the way fecility to teach is remarkable. Thank you!"
        },
        {
            username: "Unnati Patel",
            image: student4,
            desc: "After completing Std 10. I have desided to join the Remote Learn. and choosen Designing Field of and today I work as a Web Designer in a very reputed company and I am a lead Web designer in that company. And since the job is 8 hours, I do freelance work comfortably. So behind this success, I would like to thank Remote Learn and the mentors there and send a message that every student should recognize their inner strength, advance their career, and take up skill education."
        }
    ]

    return (
        <div className="testimonials">
            <h2 className="title">
                What Our Students are Saying
            </h2>
            <div className="backgroundFont">
                <img loading="lazy" src={testimonialFont} alt="" />
            </div>
            <div className="container">
                <div className="slider">
                    <div className={`allSlides active${slideIndex}`}>
                        {
                            reviews.map((review, index) => {
                                return (
                                    <div key={index} className="slide">
                                        <div className="left">
                                            <img loading="lazy" src={review.image} alt="" />
                                        </div>
                                        <div className="right">
                                            <p className="desc">
                                                "{review.desc}"
                                            </p>
                                            <p className="username">
                                                {review.username}
                                            </p>
                                            <Link className="viewClass" to="/services">
                                                View Classes <ion-icon name="arrow-forward"></ion-icon>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="slideController">
                    {
                        reviews.map((review, index) => {
                            return (
                                <div key={index} onClick={() => {
                                    setSlideIndex(index)
                                }} className={(slideIndex === index) ? "dot active" : "dot"}>
                                </div>
                            )
                        })
                    }
                </div>
            </div>

        </div>
    )
}

export default Testimonials