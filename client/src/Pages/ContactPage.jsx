import React, { useState } from 'react'
import ContactForm from '../Components/ContactForm';
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const ContactPage = () => {

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
        <div className="contactPage" style={{ position: "relative" }}>
            <Navbar scrolled={showScroll} />
            <ContactForm />
            <Footer />
        </div>
    )
}

export default ContactPage