import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../Assets/logo.png';

const Navbar = ({ top, color, page, scrolled }) => {
    const location = useLocation();
    const currentRoute = location.pathname.split("/")[1];

    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState(false);

    return (
        <>
            <div className={scrolled ? (page === "home" ? "navbar homeNav scrolled" : "navbar scrolled") : (page === "home" ? "navbar homeNav" : "navbar")}>
                <div className="leftNav">
                    <Link to="/">
                        <img src={logo} alt="" />
                    </Link>
                </div>
                <div className="rightNav">
                    <div className={currentRoute === "services" ? "btns servicePage" : "btns"}>
                        <button onClick={() => { navigate("/services") }} className="navBtn joinNow">
                            Enroll Now
                        </button>
                        <button onClick={() => { navigate("/demo-class") }} className="navBtn freeClass">
                            Demo Class
                        </button>
                    </div>
                    <div className="menus">
                        <ul>
                            <li className={currentRoute ? "" : "active"}>
                                <Link to="/">
                                    Home
                                </Link>
                            </li>
                            <li className={currentRoute === "about" ? "active" : ""}>
                                <Link to="/about">
                                    About Us
                                </Link>
                            </li>
                            <li className={currentRoute === "services" ? "active" : ""}>
                                <Link to="/services">
                                    Services
                                </Link>
                            </li>
                            <li className={currentRoute === "contact" ? "active" : ""}>
                                <Link to="/contact">
                                    Contact Us
                                </Link>
                            </li>
                            <li className={currentRoute === "referral" ? "active" : ""}>
                                <Link to="/referral">
                                    Referral
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="mobileNavbar">
                <div className="topNavbar">
                    <Link to="/">
                        <img src={logo} alt="" />
                    </Link>
                </div>
                <div className={currentRoute === "services" ? "servicePageMobile bottomNavbar" : "bottomNavbar"}>
                    <button onClick={() => { navigate("/services") }} className="navBtn joinNow">
                        Join Now
                    </button>
                    <button onClick={() => { navigate("/demo-class") }} className="navBtn freeClass">
                        Demo Class
                    </button>
                </div>
                <div className={activeMenu ? "active hamburger" : "hamburger"} onClick={() =>
                    setActiveMenu(!activeMenu)
                }>
                    <div className="line1 line"></div>
                    <div className="line2 line"></div>
                    <div className="line3 line"></div>
                </div>

                <div className={activeMenu ? "activeMenu mobileMenu" : "mobileMenu"}>
                    <ul>
                        <li className={currentRoute ? "" : "active"}>
                            <Link to="/">
                                Home
                            </Link>
                        </li>
                        <li className={currentRoute === "about" ? "active" : ""}>
                            <Link to="/about">
                                About Us
                            </Link>
                        </li>
                        <li className={currentRoute === "services" ? "active" : ""}>
                            <Link to="/services">
                                Services
                            </Link>
                        </li>
                        <li className={currentRoute === "contact" ? "active" : ""}>
                            <Link to="/contact">
                                Contact Us
                            </Link>
                        </li>
                        <li className={currentRoute === "referral" ? "active" : ""}>
                            <Link to="/referral">
                                Referral
                            </Link>
                        </li>
                    </ul>

                    <div className="menuBottom">
                        <p className="menuSlogan">
                            Remote Learn offers a new and refreshing approach to achieving your goals.
                        </p>
                        <div className="shortLinks">
                            <a target="_blank" rel="noreferrer" >
                                <ion-icon name="logo-instagram"></ion-icon>
                            </a>
                            <a target="_blank" rel="noreferrer">
                                <ion-icon name="logo-facebook"></ion-icon>
                            </a>
                        </div>
                        <p className="emailId">
                            <span>EMAIL: </span>admin@remotelearn.org
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar