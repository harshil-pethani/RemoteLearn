import React, { useState } from 'react'
import Navbar from "../Components/Navbar";
import UserDetail from '../Components/UserDetail';
import Footer from '../Components/Footer';

const UserDetailPage = () => {
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
        <div className="userDetailPage" style={{ position: "relative" }}>
            <Navbar color="black" scrolled={showScroll} />
            <UserDetail />
            <Footer />
        </div>
    )
}

export default UserDetailPage