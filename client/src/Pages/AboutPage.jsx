import React, { useState } from 'react'
import Navbar from '../Components/Navbar'
import Trainers from '../Components/Trainers'
import Footer from "../Components/Footer";
import WhyChoose from '../Components/WhyChoose'

const AboutPage = () => {
    const [showScroll, setShowScroll] = useState(false);

    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 20) {
            setShowScroll(true)
        } else if (showScroll && window.pageYOffset <= 20) {
            setShowScroll(false)
        }
    };

    window.addEventListener('scroll', checkScrollTop)

    
    return (
        <div className="aboutpage" style={{ position: "relative" }}>
            <Navbar scrolled={showScroll} />
            <WhyChoose />
            <Trainers />
            <Footer />
        </div>
    )
}

export default AboutPage